import { motion } from "framer-motion";

const StoryDecorations = ({ theme }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {theme.decoration === "magic" &&
        Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-300 dark:bg-purple-500 opacity-40"
            style={{
              width: Math.random() * 20 + 5,
              height: Math.random() * 20 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [0, 1, 0],
              rotate: [0, 360, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 20,
            }}
          />
        ))}

      {theme.decoration === "adventure" &&
        Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20 dark:opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="fill-amber-800"
              viewBox="0 0 24 24"
            >
              <path
                d={
                  i % 2 === 0
                    ? "M15 4.5l-4 4L9 10l-2 2-4 2 2 4 4-2 2-2 1.5-2 4-4M13.5 7.5L16 10M10.5 13.5L13 16"
                    : "M3.5 18.49l6-6.01 4 4L22 7.99l-1.5-1.5-7 7-4-4-4.5 4.5 1.5 1.5z"
                }
              />
            </svg>
          </motion.div>
        ))}

      {theme.decoration === "nature" &&
        Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20 dark:opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, i % 2 === 0 ? 15 : -15, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="fill-green-800"
              viewBox="0 0 24 24"
            >
              <path
                d={
                  i % 3 === 0
                    ? "M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"
                    : i % 3 === 1
                    ? "M6,2C3.79,2 2,3.79 2,6V18C2,20.21 3.79,22 6,22H18C20.21,22 22,20.21 22,18V6C22,3.79 20.21,2 18,2H6M6,4H18V18H6V4M9,7V9H11V7H9M9,11V13H11V11H9M9,15V17H11V15H9M13,7V9H15V7H13M13,11V13H15V11H13M13,15V17H15V15H13Z"
                    : "M11,7H15V9H11V15H13V11H15V15A2,2 0 0,1 13,17H11A2,2 0 0,1 9,15V9A2,2 0 0,1 11,7M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"
                }
              />
            </svg>
          </motion.div>
        ))}

      {theme.decoration === "default" &&
        Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400 dark:bg-blue-600 opacity-10 dark:opacity-20"
            style={{
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              borderRadius: "50%",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
    </div>
  );
};

export default StoryDecorations;
