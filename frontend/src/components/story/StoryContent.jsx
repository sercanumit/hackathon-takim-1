import { motion } from "framer-motion";
import {
  BothTextAndImageLayout,
  TextOnlyLayout,
  ImageOnlyLayout,
} from "./StoryLayout";

const StoryContent = ({ item, index, pageStyles, theme, BASE_URL }) => {
  const styleIndex = index % pageStyles.length;
  const hasText = item.text && item.text.trim().length > 0;
  const hasImage = item.image;

  return (
    <div
      key={`content-${index}`}
      className={`section relative overflow-hidden ${pageStyles[styleIndex]}`}
    >
      {/* Page turning animation overlay */}
      <motion.div
        className="absolute inset-0 bg-black origin-left"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.8 }}
        style={{ transformOrigin: "left" }}
      />

      {/* Enhanced paper texture */}
      <div className="absolute inset-0 paper-texture opacity-30"></div>

      {/* Improved page edge effects */}
      <div className="absolute right-0 top-0 bottom-0 w-8 paper-fold-right"></div>
      <div className="absolute left-0 top-0 bottom-0 w-8 paper-fold-left"></div>
      <div className="absolute left-0 right-0 bottom-0 h-8 paper-fold-bottom"></div>

      {/* Decorative page elements */}
      <div className="absolute top-8 left-8 opacity-20 dark:opacity-30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className={theme.accent}
        >
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      </div>

      {/* Enhanced page number */}
      <motion.div
        className={`absolute bottom-4 right-4 ${theme.secondary} px-8 py-2 rounded-full text-xl font-serif italic flex items-center`}
        whileHover={{ scale: 1.2, rotate: 5 }}
      >
        <span className={theme.accent}>{index + 1}</span>
      </motion.div>

      {/* Content layout based on what's available */}
      {hasText && hasImage && (
        <div className="container mx-auto px-4 py-12 h-full">
          <div className="flex flex-col h-full items-center book-content">
            <BothTextAndImageLayout
              index={index}
              item={item}
              theme={theme}
              BASE_URL={BASE_URL}
            />

            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-gray-400 dark:border-gray-600 opacity-50"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gray-400 dark:border-gray-600 opacity-50"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gray-400 dark:border-gray-600 opacity-50"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-gray-400 dark:border-gray-600 opacity-50"></div>
          </div>
        </div>
      )}

      {/* Text only layout */}
      {hasText && !hasImage && <TextOnlyLayout item={item} theme={theme} />}

      {/* Image only layout */}
      {!hasText && hasImage && (
        <ImageOnlyLayout item={item} BASE_URL={BASE_URL} />
      )}
    </div>
  );
};

export default StoryContent;
