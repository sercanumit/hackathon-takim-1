import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function StoryGalleryPage() {
  // In a real app, these would come from an API
  const [featuredStories, setFeaturedStories] = useState([]);
  const [newStories, setNewStories] = useState([]);
  const [popularStories, setPopularStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      // This would be replaced with actual API calls
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Sample data
      const featured = [
        {
          id: 1,
          title: "Küçük Kaşif'in Orman Macerası",
          image:
            "https://placehold.co/600x400/9333EA/FFFFFF/png?text=Orman+Macerası",
          description:
            "Küçük bir çocuğun büyülü ormanda karşılaştığı zorlukları aşma hikayesi.",
          likes: 234,
          category: "Macera",
          publishedDate: "2023-11-15",
        },
        {
          id: 2,
          title: "Uzay Yolcuları",
          image:
            "https://placehold.co/600x400/3B82F6/FFFFFF/png?text=Uzay+Yolcuları",
          description:
            "Dört arkadaşın galaksiler arası unutulmaz bir yolculuğa çıkması.",
          likes: 186,
          category: "Bilim Kurgu",
          publishedDate: "2023-12-03",
        },
        {
          id: 3,
          title: "Kayıp Hazine",
          image:
            "https://placehold.co/600x400/10B981/FFFFFF/png?text=Kayıp+Hazine",
          description:
            "Gizemli bir haritanın peşinden giden kardeşlerin macera dolu hikayesi.",
          likes: 127,
          category: "Macera",
          publishedDate: "2024-01-08",
        },
      ];

      const newOnes = [
        {
          id: 4,
          title: "Denizin Derinlikleri",
          image:
            "https://placehold.co/600x400/0EA5E9/FFFFFF/png?text=Denizin+Derinlikleri",
          description: "Okyanuslarda keşfedilmemiş dünyalara yolculuk.",
          likes: 42,
          category: "Keşif",
          publishedDate: "2024-04-11",
        },
        {
          id: 5,
          title: "Cesur Şövalye",
          image:
            "https://placehold.co/600x400/F59E0B/FFFFFF/png?text=Cesur+Şövalye",
          description:
            "Krallığını kurtarmaya çalışan genç bir şövalyenin hikayesi.",
          likes: 38,
          category: "Fantastik",
          publishedDate: "2024-04-03",
        },
        {
          id: 6,
          title: "Gökyüzünün Çocukları",
          image:
            "https://placehold.co/600x400/EC4899/FFFFFF/png?text=Gökyüzü+Çocukları",
          description: "Uçan bir şehirde yaşayan çocukların maceraları.",
          likes: 29,
          category: "Fantastik",
          publishedDate: "2024-03-28",
        },
        {
          id: 7,
          title: "Robotların Dünyası",
          image:
            "https://placehold.co/600x400/6366F1/FFFFFF/png?text=Robotlar+Dünyası",
          description: "Robotların insanlarla birlikte yaşadığı bir gelecek.",
          likes: 18,
          category: "Bilim Kurgu",
          publishedDate: "2024-03-22",
        },
      ];

      const popular = [
        {
          id: 8,
          title: "Büyülü Kitap",
          image:
            "https://placehold.co/600x400/8B5CF6/FFFFFF/png?text=Büyülü+Kitap",
          description:
            "Okuyanı başka dünyalara götüren gizemli bir kitabın hikayesi.",
          likes: 312,
          category: "Fantastik",
          publishedDate: "2023-10-05",
        },
        {
          id: 9,
          title: "Hayvanlar Kulübü",
          image:
            "https://placehold.co/600x400/D97706/FFFFFF/png?text=Hayvanlar+Kulübü",
          description: "Ormanda yaşayan hayvanların dostluk macerası.",
          likes: 289,
          category: "Dostluk",
          publishedDate: "2023-09-17",
        },
        {
          id: 10,
          title: "Dedektif Minikler",
          image:
            "https://placehold.co/600x400/DC2626/FFFFFF/png?text=Dedektif+Minikler",
          description: "Mahallelerindeki gizemi çözmeye çalışan çocuklar.",
          likes: 265,
          category: "Gizem",
          publishedDate: "2023-12-12",
        },
        {
          id: 11,
          title: "Dört Mevsim",
          image:
            "https://placehold.co/600x400/059669/FFFFFF/png?text=Dört+Mevsim",
          description:
            "Mevsimlerin değişimiyle birlikte değişen bir dostluğun hikayesi.",
          likes: 254,
          category: "Doğa",
          publishedDate: "2024-02-01",
        },
      ];

      setFeaturedStories(featured);
      setNewStories(newOnes);
      setPopularStories(popular);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 17 },
    },
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };

  // Story Card Component
  const StoryCard = ({ story, featured = false }) => (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md ${
        featured ? "col-span-1 md:col-span-2 lg:col-span-1" : ""
      }`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layoutId={`story-${story.id}`}
    >
      <div className="relative">
        <img
          src={story.image}
          alt={story.title}
          className={`w-full object-cover ${
            featured ? "h-48 md:h-64" : "h-40"
          }`}
        />
        <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
          {story.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
          {story.title}
        </h3>

        {/* Date display added below title */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2 text-xs">
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
          <span>{formatDate(story.publishedDate)}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {story.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>{story.likes}</span>
          </div>

          <Link
            to={`/stories/${story.id}`}
            className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline flex items-center"
          >
            Okumaya Başla
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  // Loading skeleton component
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
      <div className="bg-gray-200 dark:bg-gray-700 h-40 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Section title component
  const SectionTitle = ({ title, viewAllLink }) => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
        {title}
      </h2>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="text-purple-600 dark:text-purple-400 hover:underline flex items-center font-medium"
        >
          Tümünü Gör
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hikaye Galerisi
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Keşfetmeyi bekleyen binlerce interaktif hikaye arasından seçim yapın
          </motion.p>
        </div>

        {/* Featured Stories Section */}
        <section className="mb-16">
          <SectionTitle
            title="Öne Çıkan Hikayeler"
            viewAllLink="/stories/featured"
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={`featured-skeleton-${i}`} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {featuredStories.map((story) => (
                <StoryCard
                  key={`featured-${story.id}`}
                  story={story}
                  featured={true}
                />
              ))}
            </motion.div>
          )}
        </section>

        {/* New Stories Section */}
        <section className="mb-16">
          <SectionTitle title="Yeni Hikayeler" viewAllLink="/stories/new" />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={`new-skeleton-${i}`} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {newStories.map((story) => (
                <StoryCard key={`new-${story.id}`} story={story} />
              ))}
            </motion.div>
          )}
        </section>

        {/* Popular Stories Section */}
        <section className="mb-16">
          <SectionTitle
            title="Popüler Hikayeler"
            viewAllLink="/stories/popular"
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={`popular-skeleton-${i}`} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {popularStories.map((story) => (
                <StoryCard key={`popular-${story.id}`} story={story} />
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}

export default StoryGalleryPage;
