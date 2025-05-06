import json
import logging
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from pydantic import ValidationError
import base64
import io
from io import BytesIO
import uuid
import aiofiles
from pathlib import Path
from typing import Optional
from google import genai as ggenai
from google.genai import types as google_genai_types # Added import for GenerateContentConfig
import asyncio
from functools import partial

from app.models.ai_story import AIStoryOutput, AIPageContent
from config import Config
from app.utils.file_utils import UPLOADS_DIR

logger = logging.getLogger(__name__)


GOOGLE_API_KEY = Config.GOOGLE_API_KEY


JSON_FORMAT_INSTRUCTIONS = """
You MUST output your response in a JSON format. All text fields (title, description, content text, tags) MUST be in TURKISH.
The JSON object should match the following structure:
{
  "title": "A Catchy Title in TURKISH (2-3 words, e.g., 'Cesur Tavşan')",
  "description": "A short lesson or moral of the story in TURKISH. (e.g., 'Başkalarına karşı her zaman nazik ol.')",
  "age_group": "Specify an appropriate age group (e.g., '3-6', '7-10', 'all', '13+').",
  "image_prompt": "A short, descriptive prompt in ENGLISH for a COVER IMAGE that visually represents the entire story. e.g., 'A brave rabbit looking at a castle on a hill'. This prompt will be used for cover image generation.",
  "content": [
    {"text": "Text for page 1 in TURKISH. Keep it VERY SHORT (1-2 sentences), simple, and engaging for children. Ensure a positive message.", "image_prompt": "A short, descriptive prompt in ENGLISH for an image that visually represents the text for this page. e.g., 'A brave rabbit standing on a hill at sunset'. This prompt will be used for image generation.", "image": null},
    {"text": "Text for page 2 in TURKISH. Continue the story. Keep it VERY SHORT (1-2 sentences). No graphic or violent scenes.", "image_prompt": "Another short, descriptive prompt in ENGLISH for an image for this page.", "image": null},
    // Add more pages if needed, up to 15 pages. Each page's text must be VERY SHORT.
    // If no suitable image is relevant for a page, image_prompt can be null.
  ],
  "tags": ["relevant_tag1_in_turkish", "relevant_tag2_in_turkish", "story_topic_tag_in_turkish"]
}
The 'image' field in each content page, and the root 'image' field (for the cover) should initially be null in your JSON output; they will be populated later if image generation is successful.
The story must be suitable for children: simple language, positive message, and no graphic or violent scenes.
The title should be 2-3 catchy words in TURKISH.
The description should be a short lesson or moral in TURKISH.
Content should be a list of objects, representing multiple pages (e.g., 3 to 6 pages). Each page's text must be VERY SHORT and in TURKISH.
Tags should match the story's topic and be in TURKISH.
ALL Image prompts (for cover and pages) MUST be in ENGLISH.
"""

async def save_base64_image_async(base64_data_string: str, file_extension: str, filename_prefix: str = "story_page") -> Optional[str]:
    """
    Decodes a base64 string (without data URI header), saves it as an image file asynchronously, 
    and returns its relative path.
    """
    if not base64_data_string:
        return None
    try:
        img_data = base64.b64decode(base64_data_string)

        # Ensure UPLOADS_DIR exists
        UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

        # Ensure file_extension starts with a dot
        if not file_extension.startswith('.'):
            file_extension = '.' + file_extension

        unique_filename = f"{filename_prefix}_{uuid.uuid4()}{file_extension}"
        file_path = UPLOADS_DIR / unique_filename
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(img_data)
            
        return f"/uploads/images/{unique_filename}"  # Relative path for DB
    except Exception as e:
        logger.error(f"Failed to save base64 image ({filename_prefix}): {e}")
        return None

async def generate_story_from_ai(user_prompt: str, category: str) -> AIStoryOutput:
    """
    Generates a story using Google Gemini model via LangChain for both text and the google-genai client for image generation.
    """
    if not GOOGLE_API_KEY:
        logger.error("GOOGLE_API_KEY not configured for AI generation.")
        raise ValueError("AI service is not configured. Missing GOOGLE_API_KEY.")

    # Initialize the Gemini model for text generation (LangChain)
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", google_api_key=GOOGLE_API_KEY)

    parser = JsonOutputParser(pydantic_object=AIStoryOutput)

    prompt_template = PromptTemplate(
        template="Generate a child-friendly story in TURKISH based on the following details.\n"
                 "User Prompt: {user_prompt}\n"
                 "Category: {category}\n"
                 "ALL textual output (title, description, content text, tags) MUST be in TURKISH.\n"
                 "Image prompts (image_prompt) MUST be in ENGLISH.\n"
                 "{format_instructions}\n",
        input_variables=["user_prompt", "category"],
        partial_variables={"format_instructions": parser.get_format_instructions() + "\n" + JSON_FORMAT_INSTRUCTIONS}
    )

    chain = prompt_template | llm | parser

    try:
        logger.info(f"Generating AI story text for prompt: '{user_prompt}', category: '{category}'")
        ai_response_data = await chain.ainvoke({
            "user_prompt": user_prompt,
            "category": category
        })
        
        if isinstance(ai_response_data, dict):
             validated_response = AIStoryOutput(**ai_response_data)
        elif isinstance(ai_response_data, AIStoryOutput):
             validated_response = ai_response_data
        else:
            logger.error(f"Unexpected AI text response type: {type(ai_response_data)}")
            raise ValueError("AI generated an unexpected text response format.")

        # Initialize google-genai client for image generation
        image_gen_client = ggenai.Client(api_key=GOOGLE_API_KEY)
        image_model_name = 'gemini-2.0-flash-exp-image-generation' # Using the Gemini 2.0 Flash model for images

        # Generate cover image if prompt is available
        cover_image_prompt = None
        # Try both attribute and dict access for compatibility
        if hasattr(validated_response, 'image_prompt') and getattr(validated_response, 'image_prompt', None):
            cover_image_prompt = getattr(validated_response, 'image_prompt')
        elif isinstance(ai_response_data, dict) and ai_response_data.get('image_prompt'):
            cover_image_prompt = ai_response_data['image_prompt']

        if cover_image_prompt:
            try:
                logger.info(f"Generating COVER image for prompt: '{cover_image_prompt}' using model {image_model_name}")
                image_generation_prompt_text = f"Create a child-friendly illustration for a story cover: {cover_image_prompt}. Make it colorful, detailed, and captivating."
                loop = asyncio.get_event_loop()
                img_gen_config = google_genai_types.GenerateContentConfig(
                    response_modalities=['TEXT', 'IMAGE']
                )
                response = await loop.run_in_executor(
                    None,
                    partial(
                        image_gen_client.models.generate_content,
                        model=image_model_name,
                        contents=image_generation_prompt_text,
                        config=img_gen_config
                    )
                )

                if response and hasattr(response, 'candidates') and len(response.candidates) > 0:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                        for i, part in enumerate(candidate.content.parts):
                            if hasattr(part, 'inline_data') and part.inline_data is not None and part.inline_data.mime_type.startswith('image/'):
                                image_bytes = part.inline_data.data
                                mime_type = part.inline_data.mime_type
                                file_ext = ".png"  # Default
                                if mime_type == "image/jpeg":
                                    file_ext = ".jpg"
                                elif mime_type == "image/png":
                                    file_ext = ".png"
                                elif mime_type == "image/webp":
                                    file_ext = ".webp"
                                
                                base64_image_data_string = base64.b64encode(image_bytes).decode('utf-8')
                                saved_image_path = await save_base64_image_async(
                                    base64_data_string=base64_image_data_string, 
                                    file_extension=file_ext,
                                    filename_prefix="story_cover" # Different prefix for cover
                                )
                                if saved_image_path:
                                    validated_response.image = saved_image_path
                                    logger.info(f"Successfully generated and saved COVER image for prompt: {cover_image_prompt}")
                                else:
                                    logger.warning(f"Failed to save COVER image for prompt: {cover_image_prompt} after getting inline_data.")
                                break # Found image part
                    else:
                        logger.warning("No image part found in cover image candidate.")
                else:
                    logger.warning("No candidates returned for cover image generation.")
            except Exception as img_exc:
                logger.error(f"Error generating COVER image for prompt '{cover_image_prompt}': {str(img_exc)}", exc_info=True)
            # Only remove image_prompt after generation attempt
            if hasattr(validated_response, 'image_prompt'):
                try:
                    delattr(validated_response, 'image_prompt')
                except Exception:
                    pass
        else:
            logger.warning("No image_prompt found for cover image generation in AI response.")

        for page_content in validated_response.content:
            if page_content.image_prompt:
                try:
                    logger.info(f"Generating image for prompt: '{page_content.image_prompt}' using model {image_model_name}")

                    image_generation_prompt_text = f"Create a child-friendly illustration of: {page_content.image_prompt}. Make it colorful and detailed."

                    loop = asyncio.get_event_loop()
                    
                    # Configuration for image generation as per user's example
                    img_gen_config = google_genai_types.GenerateContentConfig(
                        response_modalities=['TEXT', 'IMAGE']
                    )

                    response = await loop.run_in_executor(
                        None,
                        partial(
                            image_gen_client.models.generate_content,
                            model=image_model_name,
                            contents=image_generation_prompt_text,
                            config=img_gen_config # Using config as per user's example
                        )
                    )

                    if response and hasattr(response, 'candidates') and len(response.candidates) > 0:
                        candidate = response.candidates[0]
                        logger.info(f"Image generation candidate for prompt '{page_content.image_prompt}': Finish reason: {candidate.finish_reason if hasattr(candidate, 'finish_reason') else 'N/A'}, Safety ratings: {candidate.safety_ratings if hasattr(candidate, 'safety_ratings') else 'N/A'}")
                        
                        image_found_in_parts = False
                        if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                            logger.info(f"Number of parts in candidate content for prompt '{page_content.image_prompt}': {len(candidate.content.parts)}")
                            for i, part in enumerate(candidate.content.parts):
                                logger.info(f"Processing part {i} for prompt '{page_content.image_prompt}': Type: {type(part)}")
                                if hasattr(part, 'text') and part.text: # Log any text part
                                    logger.info(f"Part {i} for prompt '{page_content.image_prompt}' has text: {part.text[:200]}")
                                
                                if hasattr(part, 'inline_data') and part.inline_data is not None and part.inline_data.mime_type.startswith('image/'):
                                    logger.info(f"Part {i} for prompt '{page_content.image_prompt}' has inline_data with mime_type: {part.inline_data.mime_type}")
                                    image_bytes = part.inline_data.data # These are raw bytes
                                    mime_type = part.inline_data.mime_type
                                    
                                    file_ext = ".png"  # Default
                                    if mime_type == "image/jpeg":
                                        file_ext = ".jpg"
                                    elif mime_type == "image/png":
                                        file_ext = ".png"
                                    elif mime_type == "image/webp":
                                        file_ext = ".webp"
                                    # Add other image types if needed
                                    
                                    # Convert raw bytes to base64 encoded string for save_base64_image_async
                                    base64_image_data_string = base64.b64encode(image_bytes).decode('utf-8')
                                    
                                    saved_image_path = await save_base64_image_async(
                                        base64_data_string=base64_image_data_string, 
                                        file_extension=file_ext
                                        # filename_prefix will use default "story_page" from function definition
                                    )
                                    
                                    if saved_image_path:
                                        page_content.image = saved_image_path
                                        logger.info(f"Successfully generated and saved image for prompt: {page_content.image_prompt}")
                                        image_found_in_parts = True
                                        break # Image found and saved, exit parts loop
                                    else:
                                        logger.warning(f"Failed to save image for prompt: {page_content.image_prompt} after getting inline_data.")
                                else:
                                    # Log if part.inline_data is None or not an image
                                    inline_data_info = 'N/A'
                                    if hasattr(part, 'inline_data'):
                                        if part.inline_data is None:
                                            inline_data_info = 'is None'
                                        else:
                                            inline_data_info = f"mime_type: {part.inline_data.mime_type}"
                                    logger.info(f"Part {i} for prompt '{page_content.image_prompt}' does not have usable image inline_data. Inline_data info: {inline_data_info}")
                            
                            if not image_found_in_parts:
                                logger.warning(f"No image data found and saved from any part for prompt: {page_content.image_prompt}. All parts inspected.")
                        else:
                            logger.warning(f"Response candidate for prompt '{page_content.image_prompt}' has no 'content' or no 'parts'. Candidate content: {candidate.content if hasattr(candidate, 'content') else 'N/A'}")
                    else:
                        logger.warning(f"No valid candidates in API response for prompt: {page_content.image_prompt}. Full response object: {response}")
                        if response and hasattr(response, 'prompt_feedback'):
                             logger.warning(f"Prompt feedback for prompt '{page_content.image_prompt}': {response.prompt_feedback}")
                
                except Exception as img_exc:
                    logger.error(f"Error generating image for prompt '{page_content.image_prompt}': {str(img_exc)}", exc_info=True)
                
            page_content.image_prompt = None # Clear prompt regardless of success/failure
        
        return validated_response

    except json.JSONDecodeError as e:
        logger.error(f"Failed to decode JSON from AI response: {e}")
        raise ValueError(f"AI response was not valid JSON: {e}")
    except ValidationError as e:
        logger.error(f"AI response failed Pydantic validation: {e}")
        raise ValueError(f"AI response did not match expected structure: {e}")
    except Exception as e:
        logger.error(f"Error generating story from AI: {e}")
        raise Exception(f"Failed to generate story using AI: {str(e)}")

