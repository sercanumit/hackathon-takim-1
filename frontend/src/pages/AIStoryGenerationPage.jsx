import { useEffect } from "react";
import { motion } from "framer-motion";
import AIStoryGenerationForm from "../components/stories/AIStoryGenerationForm";

const AIStoryGenerationPage = () => {
  useEffect(() => {
    document.title = "AI ile Hikaye Oluştur";

    return () => {
      document.title = "İnteraktif Hikayeler";
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300">
              AI ile Hikaye Oluştur
            </span>
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            İstediğiniz temada, karakterde ve konuda yapay zeka yardımıyla özgün
            hikayeler oluşturun. Detaylı isteğinizi yazın ve AI sizin için bir
            hikaye üretsin.
          </p>
        </motion.div>

        {/* Magic sparkles decoration */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-300 dark:bg-purple-500 opacity-40"
              style={{
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AIStoryGenerationForm />
        </motion.div>

        <motion.div
          className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p>
            AI tarafından oluşturulan hikayeler, bazen beklenmedik veya alakasız
            içerikler içerebilir. Bu nedenle, oluşturulan hikayeleri dikkatlice
            gözden geçirmeniz önemlidir.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AIStoryGenerationPage;
