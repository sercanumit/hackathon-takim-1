import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StoryCard from "../components/cards/StoryCard";
import SkeletonCard from "../components/cards/SkeletonCard";
import apiClient from "../api/apiClient";

function PopularStoriesPage() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchPopularStories = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/api/stories/popular", {
          params: { limit: 20 },
        });
        setStories(response.data.stories);
      } catch (err) {
        console.error("Error fetching popular stories:", err);
        setError("Popüler hikayeleri yüklerken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularStories();
  }, []);

  const categories = [
    "all",
    ...new Set(stories.map((story) => story.category).filter(Boolean)),
  ];

  const filteredStories =
    selectedCategory === "all"
      ? stories
      : stories.filter((story) => story.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Hata
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={() => window.location.reload()}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 dark:from-purple-800 dark:via-indigo-700 dark:to-blue-800 border-b-4 border-yellow-300 dark:border-yellow-500">
        <div className="container mx-auto px-4 py-10 md:py-14 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4">
              <span className="relative inline-block">
                <span className="flex items-center">
                  {/* Crown icon */}
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 576 512"
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.2, 1.2, 1.2, 1],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
                  </motion.svg>
                  <motion.span
                    className="text-white text-4xl md:text-5xl font-bold ml-4"
                    animate={{
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 4,
                    }}
                  >
                    Masalsı Hikayeler
                  </motion.span>
                </span>
              </span>
            </div>
            <motion.p
              className="text-lg text-yellow-100 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Okuyucuların kalbini kazanan en sevilen hikayeler
            </motion.p>
          </motion.div>
        </div>

        {/* decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 6 + 2 + "px",
                height: Math.random() * 6 + 2 + "px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -30],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <motion.div
          className="absolute right-10 top-10"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <svg
            className="h-12 w-12 text-yellow-300 opacity-70"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute left-[15%] bottom-5"
          animate={{
            y: [0, 10, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <svg
            className="h-10 w-10 text-amber-300 opacity-60"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
        </motion.div>
      </section>

      {/* category filter */}
      <section className="bg-white dark:bg-gray-800 py-4 shadow-md sticky top-0 z-20 border-b-2 border-purple-200 dark:border-purple-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center">
            <span className="mr-4 text-gray-800 dark:text-white font-medium">
              <span className="text-purple-600 dark:text-purple-400">✧</span>{" "}
              Kategoriler{" "}
              <span className="text-purple-600 dark:text-purple-400">✧</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all" ? "Tümü" : category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* main content */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <motion.div
            className="space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* top 3 */}
            {filteredStories.length > 0 && (
              <motion.div variants={itemVariants} className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800 dark:text-white text-center">
                  <span className="border-b-4 border-purple-500 pb-2 px-4 relative inline-block">
                    En Popüler Hikayeler
                    <motion.span
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-purple-500 text-2xl"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredStories.slice(0, 3).map((story, index) => (
                    <motion.div
                      key={story.id}
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ y: -5 }}
                    >
                      {/* ranking badges */}
                      <div
                        className={`absolute -top-6 -left-6 w-12 h-12 rounded-full border-2 
                        ${
                          index === 0
                            ? "bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-200"
                            : index === 1
                            ? "bg-gradient-to-b from-gray-300 to-gray-400 border-gray-200"
                            : "bg-gradient-to-b from-amber-600 to-amber-800 border-amber-500"
                        } 
                        flex items-center justify-center z-10 shadow-lg`}
                      >
                        {index === 0 ? (
                          <svg
                            className="h-8 w-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 576 512"
                          >
                            <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
                          </svg>
                        ) : (
                          <span className="font-bold text-xl text-white drop-shadow-md">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div
                        className={`absolute -top-1 -right-1 w-full h-full rounded-xl border-2 ${
                          index === 0
                            ? "border-yellow-300"
                            : index === 1
                            ? "border-gray-300"
                            : "border-amber-600"
                        } -z-10 opacity-40`}
                      ></div>
                      <StoryCard
                        story={{
                          ...story,
                          publishedDate: story.published_date,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* remaining stories  */}
            {filteredStories.length > 3 && (
              <motion.div variants={itemVariants} className="relative">
                <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white text-center py-2">
                  <span className="border-b-4 border-gray-300 pb-2 px-4">
                    Diğer Sevilen Hikayeler
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredStories.slice(3).map((story, index) => (
                    <StoryCard
                      key={story.id}
                      story={{
                        ...story,
                        publishedDate: story.published_date,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {filteredStories.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <motion.div
                  className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md inline-block border-2 border-purple-200 dark:border-purple-800"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    className="mx-auto h-16 w-16 text-purple-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {selectedCategory === "all"
                      ? "Henüz Masalsı Hikaye Bulunmuyor"
                      : `"${selectedCategory}" kategorisinde hikaye bulunmuyor`}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedCategory === "all"
                      ? "Daha sonra tekrar kontrol etmeyi deneyin"
                      : "Başka bir kategori seçmeyi deneyin"}
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}

export default PopularStoriesPage;
