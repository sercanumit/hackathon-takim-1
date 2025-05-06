import { motion } from "framer-motion";

// Component for layout with both text and image
export const BothTextAndImageLayout = ({ index, item, theme, BASE_URL }) => {
  const layoutVariant = index % 4;

  if (layoutVariant === 0) {
    // Image left, text right
    return (
      <div className="flex flex-col md:flex-row w-full">
        {/* Image on the left */}
        <motion.div
          className="md:w-1/2 p-8"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className={`rounded-xl overflow-hidden shadow-xl border-2 ${theme.secondary} relative`}
            whileHover={{ scale: 1.05, rotate: -1 }}
          >
            <img
              src={`${BASE_URL}${item.image}`}
              alt={`Sayfa ${index + 1}`}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none" />
          </motion.div>
        </motion.div>

        {/* Text on the right */}
        <motion.div
          className="md:w-1/2 p-8"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <StoryText text={item.text} theme={theme} />
        </motion.div>
      </div>
    );
  } else if (layoutVariant === 1) {
    // Text left, image right
    return (
      <div className="flex flex-col md:flex-row w-full">
        {/* Text on the left */}
        <motion.div
          className="md:w-1/2 p-8"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <StoryText text={item.text} theme={theme} />
        </motion.div>

        {/* Image on the right */}
        <motion.div
          className="md:w-1/2 p-8"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className={`rounded-xl overflow-hidden shadow-xl border-2 ${theme.secondary} relative`}
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
            <img
              src={`${BASE_URL}${item.image}`}
              alt={`Sayfa ${index + 1}`}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
    );
  } else if (layoutVariant === 2) {
    // Text on top, image below
    return (
      <div className="flex flex-col w-full">
        {/* Text on top */}
        <motion.div
          className="w-full p-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <StoryText text={item.text} theme={theme} />
        </motion.div>

        {/* Image below */}
        <motion.div
          className="w-full p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className={`rounded-xl overflow-hidden shadow-xl border-2 ${theme.secondary} relative max-w-xl mx-auto`}
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
            <img
              src={`${BASE_URL}${item.image}`}
              alt={`Sayfa ${index + 1}`}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
    );
  } else {
    // Image on top, text below
    return (
      <div className="flex flex-col w-full">
        {/* Image on top */}
        <motion.div
          className="w-full p-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className={`rounded-xl overflow-hidden shadow-xl border-2 ${theme.secondary} relative max-w-xl mx-auto`}
            whileHover={{ scale: 1.05, rotate: -1 }}
          >
            <img
              src={`${BASE_URL}${item.image}`}
              alt={`Sayfa ${index + 1}`}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none" />
          </motion.div>
        </motion.div>

        {/* Text below */}
        <motion.div
          className="w-full p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <StoryText text={item.text} theme={theme} />
        </motion.div>
      </div>
    );
  }
};

// Component for text-only layout
export const TextOnlyLayout = ({ item }) => (
  <div className="container mx-auto px-4 py-12 h-full flex items-center justify-center">
    <motion.div
      className="max-w-4xl w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative paper-background min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 notebook-lines"></div>
        <StoryText text={item.text} />
        {/* Decorative corners */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gray-400 dark:border-gray-600 opacity-50"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gray-400 dark:border-gray-600 opacity-50"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gray-400 dark:border-gray-600 opacity-50"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gray-400 dark:border-gray-600 opacity-50"></div>
      </div>
    </motion.div>
  </div>
);

// Component for image-only layout
export const ImageOnlyLayout = ({ item, BASE_URL }) => (
  <div className="container mx-auto px-4 py-12 h-full flex items-center justify-center">
    <motion.div
      className="max-w-4xl w-full"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 relative"
        whileHover={{ scale: 1.03, rotate: 1 }}
        dragConstraints={{
          left: -50,
          right: 50,
          top: -50,
          bottom: 50,
        }}
        dragElastic={0.1}
      >
        {/* Image with interactive corners */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-white/50 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white/50 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-white/50 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-white/50 rounded-br-lg" />
        <img
          src={`${BASE_URL}${item.image}`}
          alt="Story image"
          className="w-full h-auto object-cover transform transition-transform"
        />
        {/* Hint for drag interaction */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          exit={{ opacity: 0 }}
        >
          Hareket Ettir
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
);

// Component for animated text
const StoryText = ({ text, theme }) => (
  <motion.p
    className={`text-4xl md:text-5xl lg:text-6xl handwritten-text-custom p-8 relative z-10 max-w-3xl font-bold ${
      theme?.decoration === "fantasy"
        ? "fantasy-theme"
        : theme?.decoration === "adventure"
        ? "adventure-theme"
        : theme?.decoration === "default"
        ? "default-theme"
        : ""
    }`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {text.split(" ").map((word, wordIdx) => (
      <motion.span
        key={wordIdx}
        className="inline-block mr-1.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.03 * wordIdx,
        }}
      >
        {word}
      </motion.span>
    ))}
  </motion.p>
);
