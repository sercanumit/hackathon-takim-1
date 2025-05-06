import { motion } from "framer-motion";

export const BackButton = ({ handleGoBack, theme }) => (
  <motion.button
    onClick={handleGoBack}
    className={`fixed top-4 left-4 z-50 bg-gradient-to-r ${theme.primary} p-3 rounded-full shadow-md text-white focus:outline-none`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.2, rotate: -10 }}
    whileTap={{ scale: 0.9 }}
    aria-label="Go back"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  </motion.button>
);

export const Bookmark = ({ theme }) => (
  <div className="fixed right-4 top-0 z-50 pointer-events-none">
    <motion.div
      className={`w-12 h-32 bg-gradient-to-b ${theme.primary} shadow-lg rounded-b-lg`}
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    />
  </div>
);

export const PageCorner = () => (
  <div className="fixed right-0 bottom-0 z-50 pointer-events-none">
    <motion.div
      className="w-12 h-12 bg-amber-100 dark:bg-amber-800/30"
      style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ rotate: 10 }}
      transition={{ duration: 0.3 }}
    />
  </div>
);

export const ProgressIndicator = ({
  currentSlide,
  totalSlides,
  theme,
  fullpageApi,
}) => (
  <motion.div
    className={`fixed z-50 bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm p-2 rounded-full`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
  >
    {Array.from({ length: totalSlides }, (_, index) => (
      <motion.button
        key={`dot-${index}`}
        className={`w-3 h-3 rounded-full focus:outline-none ${
          currentSlide === index
            ? `bg-gradient-to-r ${theme.primary}`
            : "bg-gray-300 dark:bg-gray-600"
        }`}
        onClick={() => fullpageApi.moveTo(index + 1)}
        whileHover={{ scale: 1.5 }}
        whileTap={{ scale: 0.9 }}
      />
    ))}
  </motion.div>
);
