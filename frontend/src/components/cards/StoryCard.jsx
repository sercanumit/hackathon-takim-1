import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

// Helper function to format dates
const formatDate = (dateString) => {
  // check for valid dateString
  if (!dateString || isNaN(new Date(dateString))) {
    console.warn("Invalid dateString passed to formatDate:", dateString);
    return "Geçersiz Tarih"; // Return a fallback string
  }
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("tr-TR", options);
};

const StoryCard = ({ story, featured = false }) => {
  if (!story) {
    return <div className="border border-red-500 p-4">Hikaye verisi yok!</div>;
  }

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md ${
        featured ? "col-span-1 md:col-span-2 lg:col-span-1" : ""
      }`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="relative">
        <img
          src={story.image || "https://placehold.co/600x400/EEE/31343C"} // Add fallback image
          alt={story.title || "Hikaye Resmi"} // Add fallback alt text
          className={`w-full object-cover ${
            featured ? "h-48 md:h-64" : "h-40"
          }`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/EEE/31343C/png?text=Resim+Yok";
          }} // Fallback image on error
          loading="lazy" // Lazy load images
        />
        {story.category && (
          <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
            {story.category}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
          {story.title || "Başlık Yok"} {/* Fallback title */}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {story.description || "Açıklama yok."} {/* Fallback description */}
        </p>
        <div className="flex justify-between items-center text-xs">
          {" "}
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            {/* Likes */}
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
            <span>{story.likes ?? 0}</span> {/* Fallback likes */}
            <div className="flex items-center ml-4">
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
              <span>
                {story.publishedDate
                  ? formatDate(story.publishedDate)
                  : "Tarih Yok"}
              </span>
            </div>
          </div>
          <Link
            to={`/stories/${story.id}`}
            className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline flex items-center" // Kept text-sm for the link
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
};

export default StoryCard;
