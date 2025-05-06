import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import StoryCard from "../components/cards/StoryCard";
import SkeletonCard from "../components/cards/SkeletonCard";
import React, { useMemo } from "react";

function NewStoriesPage() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchNewStories = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/api/stories/new", {
          params: { limit: 20 },
        });
        setStories(response.data.stories);
      } catch (err) {
        console.error("Error fetching new stories:", err);
        setError("Yeni hikayeleri yüklerken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewStories();
  }, []);

  const categories = useMemo(
    () => [
      "all",
      ...new Set(stories.map((story) => story.category).filter(Boolean)),
    ],
    [stories]
  );

  const filteredStories = useMemo(
    () =>
      selectedCategory === "all"
        ? stories
        : stories.filter((story) => story.category === selectedCategory),
    [stories, selectedCategory]
  );

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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => window.location.reload()}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Get the base URL from your API client
  const API_BASE_URL = apiClient.defaults.baseURL || window.location.origin;

  // Helper function to properly construct image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://placehold.co/800x600/2f9e44/FFFFFF/png?text=Yeni+Hikaye";

    // If the path already starts with http or https, it's already a complete URL
    if (imagePath.startsWith("http")) return imagePath;

    // For paths that start with /uploads/, we need to ensure we're using the API base URL
    if (imagePath.startsWith("/uploads/")) {
      // Remove the baseURL's trailing slash if present
      const baseUrl = API_BASE_URL.endsWith("/")
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;
      return `${baseUrl}${imagePath}`;
    }

    // For other relative paths
    return `${window.location.origin}${
      imagePath.startsWith("/") ? "" : "/"
    }${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Kategori Filtresi */}
      <section className="sticky top-0 z-20 bg-green-500 dark:bg-green-700 shadow-md">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <span className="text-4xl mr-2 animate-pulse">🌱</span>
              <h1 className="font-bold text-2xl text-white">
                En Taze Hikayeler
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-white text-green-600 shadow-md"
                      : "bg-green-600/20 text-white border border-white/30 hover:bg-green-600/40"
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

      {/* ana açerik */}
      <section className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* hikaye içeriği */}
            {filteredStories.length > 0 ? (
              <div className="space-y-20">
                {/* öne çıkan hikaye - büyük kart */}
                {filteredStories.length > 0 && (
                  <motion.div variants={itemVariants} className="mb-16">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-green-100 dark:border-green-900">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2">
                          <div className="relative h-64 md:h-full">
                            <img
                              src={getImageUrl(filteredStories[0].image)}
                              alt={filteredStories[0].title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(
                                  "Image failed to load:",
                                  e.target.src
                                );
                                e.target.onerror = null; // Prevent infinite error loop
                                e.target.src =
                                  "https://placehold.co/800x600/2f9e44/FFFFFF/png?text=Yeni+Hikaye";
                              }}
                            />
                            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                              <span className="animate-pulse mr-1">●</span> YENİ
                              EKLENEN
                            </div>
                          </div>
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                              {filteredStories[0].title || "Başlıksız Hikaye"}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                              {filteredStories[0].description ||
                                "Bu hikaye hakkında detaylı bir açıklama bulunmuyor. Hikayeyi okumak için tıklayabilirsiniz."}
                            </p>

                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                              <span className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(
                                  filteredStories[0].published_date ||
                                    Date.now()
                                ).toLocaleDateString("tr-TR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                              <span className="mx-3">•</span>
                              <span className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                  />
                                </svg>
                                {filteredStories[0].category || "Genel"}
                              </span>
                            </div>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <Link
                              to={`/stories/${filteredStories[0].id}`}
                              className="inline-block bg-gradient-to-r from-green-500 to-teal-400 text-white font-medium px-6 py-3 rounded-lg hover:shadow-lg transition-shadow"
                            >
                              Hikayeyi Oku →
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* diğer hikayeler */}
                {filteredStories.length > 1 && (
                  <motion.div variants={itemVariants}>
                    <div className="mb-10">
                      <h2 className="inline-block text-2xl font-bold text-gray-800 dark:text-white mb-8 pb-2 border-b-2 border-green-400">
                        Diğer Yeni Hikayeler
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                      {filteredStories.slice(1).map((story, index) => (
                        <motion.div
                          key={story.id}
                          className="group relative"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          {/* Yeni İkon Rozeti */}
                          {index < 5 && (
                            <div className="absolute -top-3 -left-3 z-10">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                                <span className="text-xs font-bold text-white">
                                  YENİ
                                </span>
                              </div>
                            </div>
                          )}
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
              </div>
            ) : (
              <div className="text-center py-20">
                <motion.div
                  className="inline-block bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-xl border-2 border-green-100 dark:border-green-900"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto h-24 w-24 text-green-500 opacity-80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {selectedCategory === "all"
                      ? "Henüz Yeni Hikaye Bulunmuyor"
                      : `"${selectedCategory}" kategorisinde yeni hikaye bulunmuyor`}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                    {selectedCategory === "all"
                      ? "İlk hikayelerin eklenmesi için biraz daha bekleyin..."
                      : "Başka bir kategori seçebilir veya daha sonra tekrar kontrol edebilirsiniz."}
                  </p>
                  <motion.button
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-400 text-white font-medium rounded-lg shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      selectedCategory !== "all" && setSelectedCategory("all")
                    }
                  >
                    {selectedCategory === "all"
                      ? "Sayfayı Yenile"
                      : "Tüm Hikayeleri Göster"}
                  </motion.button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}

export default NewStoriesPage;
