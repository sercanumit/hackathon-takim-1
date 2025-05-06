import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import storyService from "../../api/storyService";

const categories = [
  "Bilim Kurgu",
  "Macera",
  "Fantastik",
  "Eğitici",
  "Komedi",
  "Dram",
  "Aksiyon",
];

const AIStoryGenerationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userPrompt: "",
    category: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.userPrompt.trim()) {
      validationErrors.userPrompt = "Lütfen hikaye için bir istek belirtin";
    }

    if (!formData.category) {
      validationErrors.category = "Lütfen bir kategori seçin";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Lütfen form hatalarını düzeltin", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      toast.info("AI hikaye oluşturma başlatılıyor...", {
        position: "bottom-center",
        autoClose: 2000,
      });

      const response = await storyService.generateAIStory(
        formData.userPrompt,
        formData.category
      );

      // Show success message and notify user about the story being ready shortly
      toast.success("Hikaye başarıyla oluşturuldu!", {
        position: "bottom-center",
        autoClose: 5000,
      });

      // Show additional message with a different toast type
      toast.info("Hikayeniz kısa bir süre sonra içerisinde hazır olacak", {
        position: "bottom-center",
        autoClose: 5000,
        icon: "🪄",
      });

      // Navigate immediately instead of using setTimeout
      // The toast notifications will still be visible for their duration
      navigate("/stories");
    } catch (error) {
      console.error("AI hikaye oluşturma hatası:", error);

      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data.detail
      ) {
        const errorDetails = error.response.data.detail;
        let errorMsg = "Formda doğrulama hataları var: ";
        errorDetails.forEach((err) => {
          errorMsg += ` ${err.loc.join(".")}: ${err.msg};`;
        });
        toast.error(errorMsg, {
          position: "bottom-center",
          autoClose: 5000,
        });
      } else {
        toast.error(
          error.message ||
            "Hikaye oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
          {
            position: "bottom-center",
            autoClose: 5000,
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
            Hikaye İsteğiniz <span className="text-red-500">*</span>
          </label>
          <textarea
            name="userPrompt"
            value={formData.userPrompt}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[150px]"
            placeholder="Bir kartalın yüksek dağların tepesindeki maceralarını anlatan, 8-12 yaş çocuklar için eğitici bir hikaye..."
          ></textarea>
          {errors.userPrompt && (
            <p className="mt-2 text-sm text-red-500">{errors.userPrompt}</p>
          )}
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Hikayeniz için ayrıntılı bir istek yazın. Yaş grubu, karakter
            özellikleri, temel olay örgüsü gibi detaylar ekleyebilirsiniz.
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Bir kategori seçin</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-2 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div className="flex justify-center">
          <motion.button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-md text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 cursor-pointer"
            } shadow-md w-full sm:w-auto`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                AI Hikaye Oluşturuluyor...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                AI ile Hikaye Oluştur
              </span>
            )}
          </motion.button>
        </div>
      </form>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              ⚡ AI Hikaye Oluşturma
            </span>{" "}
            ile istediğiniz konuda hızlıca hikayeler yaratın.
          </p>
          <p>
            Yapay zeka, belirttiğiniz kategoride ve istediğiniz konuda özgün bir
            hikaye oluşturacaktır. Daha iyi sonuçlar için, yaş grubu, karakter
            özellikleri ve hikaye konusu hakkında detaylı bilgi verin.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AIStoryGenerationForm;
