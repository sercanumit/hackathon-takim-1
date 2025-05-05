import React, { useEffect } from "react";
import { motion } from "framer-motion";
import CreateStoryForm from "../components/stories/CreateStoryForm";

const CreateStoryPage = () => {
  useEffect(() => {
    // Set the document title directly without using React Helmet
    document.title = "Yeni Hikaye Oluştur";

    // Clean up when component unmounts
    return () => {
      document.title = "İnteraktif Hikayeler";
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300">
            Yeni Hikaye Oluştur
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CreateStoryForm />
        </motion.div>
      </div>
    </div>
  );
};

export default CreateStoryPage;
