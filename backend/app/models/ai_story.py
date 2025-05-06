from pydantic import BaseModel
from typing import List, Optional

class AIStoryRequest(BaseModel):
    user_prompt: str
    category: str

class AIPageContent(BaseModel):
    text: str
    image: Optional[str] = None
    image_prompt: Optional[str] = None

class AIStoryOutput(BaseModel):
    title: str
    description: str
    age_group: str
    content: List[AIPageContent]
    tags: List[str]
    image: Optional[str] = None

