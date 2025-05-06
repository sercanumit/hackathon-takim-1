import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import storyService from "../../api/storyService";
import LikeDislikeButtons from "./LikeDislikeButtons";

const StoryDetailView = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storyPages, setStoryPages] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const fetchStoryDetail = async () => {
      try {
        const response = await storyService.getStoryDetail(storyId);
        setStory(response.data);

        // Parse the story content if it's JSON
        try {
          if (response.data.content) {
            // Content might be a JSON string of pages or just HTML
            const contentData =
              typeof response.data.content === "string"
                ? JSON.parse(response.data.content)
                : response.data.content;

            // If content is an array of pages/slides
            if (Array.isArray(contentData)) {
              setStoryPages(contentData);
            } else {
              // If it's just a single content block, treat it as one slide
              setStoryPages([{ content: response.data.content }]);
            }
          }
        } catch (jsonError) {
          // If parsing fails, it might be simple HTML content
          console.log(
            "Content is not in JSON format, treating as single HTML page"
          );
          setStoryPages([{ content: response.data.content }]);
        }
      } catch (err) {
        setError("Failed to load story. Please try again.");
        console.error("Error fetching story:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryDetail();
  }, [storyId]);

  const nextSlide = () => {
    if (currentSlideIndex < storyPages.length) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Determine if we're on the last slide (the like/dislike buttons)
  const isLastSlide = currentSlideIndex === storyPages.length;
  // Calculate total slides (content slides + like/dislike slide)
  const totalSlides = storyPages.length + 1;

  if (loading) return <div className="text-center py-10">Loading story...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!story) return <div className="text-center py-10">Story not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Toaster position="bottom-center" />

      <h1 className="text-3xl font-bold mb-6">{story.title}</h1>

      {story.image && (
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Story content slides */}
        {!isLastSlide && storyPages[currentSlideIndex] && (
          <div className="p-6 min-h-[400px]">
            {storyPages[currentSlideIndex].image && (
              <img
                src={storyPages[currentSlideIndex].image}
                alt={`Slide ${currentSlideIndex + 1}`}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: storyPages[currentSlideIndex].content || "",
                }}
              />
            </div>
          </div>
        )}

        {/* Like/Dislike buttons slide */}
        {isLastSlide && <LikeDislikeButtons storyId={storyId} />}

        {/* Navigation controls */}
        <div className="flex justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className={`px-4 py-2 rounded-md ${
              currentSlideIndex === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Önceki
          </button>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-300">
              Sayfa {currentSlideIndex + 1} / {totalSlides}
            </span>
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
            className={`px-4 py-2 rounded-md ${
              currentSlideIndex === totalSlides - 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailView;
