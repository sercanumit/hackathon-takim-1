import React from "react";
import { motion } from "framer-motion";

const PageEditor = ({ pages, onChange }) => {
  const addPage = () => {
    const newPages = [...pages, { text: "", image: null }];
    onChange(newPages);
  };

  const removePage = (index) => {
    if (pages.length > 1) {
      const newPages = [...pages];
      newPages.splice(index, 1);
      onChange(newPages);
    }
  };

  const updatePage = (index, field, value) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], [field]: value };
    onChange(newPages);
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Dosya boyutu 5MB'dan küçük olmalıdır");
        return;
      }
      updatePage(index, "image", file);
    }
  };

  const removeImage = (index) => {
    updatePage(index, "image", null);
  };

  return (
    <div className="space-y-6">
      {pages.map((page, index) => (
        <motion.div
          key={index}
          className="border border-gray-200 dark:border-gray-700 p-4 rounded-md relative bg-gray-50 dark:bg-gray-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-md text-sm font-medium">
            Sayfa {index + 1}
          </div>

          {/* Sayfa Metni */}
          <div className="mb-4 mt-8">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Metin
            </label>
            <textarea
              value={page.text || ""}
              onChange={(e) => updatePage(index, "text", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="4"
              placeholder="Hikaye metni..."
            />
          </div>

          {/* Sayfa Görseli */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Görsel
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(index, e)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100
                dark:file:bg-purple-900 dark:file:text-purple-200
                dark:text-gray-400"
            />

            {page.image && (
              <div className="mt-3 relative">
                {typeof page.image === "string" ? (
                  <img
                    src={page.image}
                    alt={`Sayfa ${index + 1}`}
                    className="max-h-40 rounded-md object-contain border border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(page.image)}
                    alt={`Sayfa ${index + 1} önizleme`}
                    className="max-h-40 rounded-md object-contain border border-gray-200 dark:border-gray-700"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Sayfa İşlemleri */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
            {/* Sayfa Silme Butonu */}
            {pages.length > 1 && (
              <button
                type="button"
                onClick={() => removePage(index)}
                className="text-red-500 hover:text-red-700 hover:cursor-pointer dark:text-red-400 dark:hover:text-red-300 flex items-center text-sm font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Sayfayı Sil
              </button>
            )}

            {/* Sıralama Bilgisi */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {index + 1} / {pages.length}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Yeni Sayfa Ekleme Butonu */}
      <div className="flex justify-center">
        <motion.button
          type="button"
          onClick={addPage}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:cursor-pointer hover:from-green-600 hover:to-green-700 text-white rounded-md shadow-md flex items-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Yeni Sayfa Ekle
        </motion.button>
      </div>
    </div>
  );
};

export default PageEditor;
