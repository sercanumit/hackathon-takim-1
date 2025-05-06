import { useState, useEffect } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import LikeDislikeButtons from "../components/story/LikeDislikeButtons";
import { motion } from "framer-motion"; // Add this import for motion components

// Import custom hook for theme colors
import useStoryTheme from "../hooks/useStoryTheme";

// Import components
import StoryDecorations from "../components/story/StoryDecorations";
import StoryCover from "../components/story/StoryCover";
import StoryContent from "../components/story/StoryContent";
import {
  BackButton,
  Bookmark,
  PageCorner,
  ProgressIndicator,
} from "../components/story/StoryNavigation";
import StoryStyles from "../components/story/StoryStyles";

const StoryFullPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sayfa arka planları için sınıflar - kağıt görünümü varyasyonları
  const pageStyles = [
    "bg-[#fffef8] dark:bg-gray-800", // Krem rengi kağıt
    "bg-[#fff9e6] dark:bg-gray-800", // Hafif sarı kağıt
    "bg-[#f5f5f0] dark:bg-gray-800", // Gri tonlu kağıt
    "bg-[#fafaf2] dark:bg-gray-800", // Açık bej kağıt
  ];

  // IMPORTANT: Call useStoryTheme at the top level with a fallback category
  // This ensures the hook is called on every render in the same order
  const theme = useStoryTheme(story?.category || "");

  // Fetch the story data
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/stories/${id}`);
        setStory(response.data);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError("Hikaye yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  // Handle going back
  const handleGoBack = () => {
    navigate(-1);
  };

  // Get the base URL for image paths
  const BASE_URL = apiClient.defaults.baseURL || "http://localhost:8000";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="text-center p-8 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Hata
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 hover:cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!story) return null;

  // Total number of slides (cover + content pages + like/dislike buttons)
  const totalSlides = 1 + (story.content?.length || 0) + 1; // Added +1 for like/dislike buttons

  return (
    <>
      {/* Decorative floating elements */}
      <StoryDecorations theme={theme} />

      {/* Navigation elements */}
      <BackButton handleGoBack={handleGoBack} theme={theme} />
      <Bookmark theme={theme} />
      <PageCorner />

      <ReactFullpage
        licenseKey={""}
        scrollingSpeed={1000}
        onLeave={(origin, destination) => {
          setCurrentSlide(destination.index);
        }}
        render={({ fullpageApi }) => (
          <ReactFullpage.Wrapper>
            {/* Cover Slide */}
            <StoryCover
              story={story}
              theme={theme}
              BASE_URL={BASE_URL}
              fullpageApi={fullpageApi}
            />

            {/* Content Slides */}
            {story.content &&
              story.content.map((item, index) => (
                <StoryContent
                  key={`content-${index}`}
                  item={item}
                  index={index}
                  pageStyles={pageStyles}
                  theme={theme}
                  BASE_URL={BASE_URL}
                />
              ))}

            {/* Like/Dislike buttons as final slide */}
            <div
              className={`section relative overflow-hidden bg-gradient-to-b ${theme.primary}`}
            >
              <div className="fp-overflow">
                {/* Decorative floating elements similar to cover */}
                <motion.div
                  className="absolute inset-0 z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ duration: 2 }}
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bg-white rounded-full"
                      style={{
                        width: Math.random() * 10 + 2,
                        height: Math.random() * 10 + 2,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Paper texture for consistency with cover */}
                <div className="absolute inset-0 paper-texture opacity-40"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 paper-fold-right"></div>
                <div className="absolute left-0 top-0 bottom-0 w-8 paper-fold-left"></div>
                <div className="absolute left-0 right-0 bottom-0 h-8 paper-fold-bottom"></div>

                <div className="container mx-auto px-4 h-full relative z-10">
                  <div className="flex flex-col items-center justify-center p-8 h-full min-h-[400px] relative">
                    <motion.div
                      className={`max-w-2xl w-full rounded-xl shadow-lg p-8 bg-white/20 backdrop-blur-sm border border-white/30 dark:bg-gray-800/50`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      whileHover={{
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <motion.h2
                        className={`text-4xl font-bold text-center mb-8 text-white drop-shadow-lg`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        Bu hikayeyi beğendin mi?
                      </motion.h2>

                      <motion.p
                        className="text-lg text-white/90 text-center mb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        Hikayeyi değerlendirerek diğer çocukların da
                        keşfetmesine yardımcı ol!
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <LikeDislikeButtons storyId={id} theme={theme} />
                      </motion.div>

                      <motion.p
                        className="text-sm text-center mt-8 text-white/80 italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                      >
                        Değerlendirmen için teşekkürler! 😊
                      </motion.p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <ProgressIndicator
              totalSlides={totalSlides}
              currentSlide={currentSlide}
              theme={theme}
              fullpageApi={fullpageApi}
            />
          </ReactFullpage.Wrapper>
        )}
      />

      <StoryStyles />
    </>
  );
};

export default StoryFullPage;
