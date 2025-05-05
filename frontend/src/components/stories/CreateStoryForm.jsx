import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import storyService from "../../api/storyService";
import PageEditor from "./PageEditor";

const categories = [
  "Bilim Kurgu",
  "Macera",
  "Fantastik",
  "Eğitici",
  "Komedi",
  "Dram",
  "Aksiyon",
];

const ageGroups = ["all", "3-5", "6-8", "9-12", "13+"];

const CreateStoryForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    age_group: "all",
    tags: "",
    image: null,
    content: [{ text: "", image: null }],
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Dosya boyutu 5MB'dan küçük olmalıdır",
        }));
        return;
      }

      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleContentChange = (pages) => {
    setFormData({ ...formData, content: pages });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Başlık gereklidir";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Açıklama gereklidir";
    }

    if (!formData.category) {
      newErrors.category = "Kategori seçmelisiniz";
    }

    if (formData.content.length === 0) {
      newErrors.content = "En az bir sayfa içeriği gereklidir";
    } else {
      const hasValidContent = formData.content.some(
        (page) => (page.text && page.text.trim()) || page.image
      );

      if (!hasValidContent) {
        newErrors.content = "En az bir sayfada metin veya görsel olmalıdır";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Lütfen form hatalarını düzeltin");
      return;
    }

    try {
      setLoading(true);
      toast.info("Hikaye verileri hazırlanıyor...");

      // Step 2: Upload Content Images and Update Content Array (Remains the same)
      toast.info("Hikaye içeriğindeki görseller işleniyor...");
      const processedContent = await Promise.all(
        formData.content.map(async (page, index) => {
          const processedPage = { ...page };
          if (page.image && typeof page.image !== "string") {
            try {
              toast.info(`Sayfa ${index + 1} görseli yükleniyor...`);
              const imageResponse = await storyService.uploadImage(page.image);
              processedPage.image = imageResponse.data.file_path;
              toast.success(`Sayfa ${index + 1} görseli yüklendi.`);
            } catch (err) {
              console.error(`Sayfa ${index + 1} görseli yükleme hatası:`, err);
              toast.error(`Sayfa ${index + 1} görseli yüklenemedi.`);
              processedPage.image = null;
            }
          }
          return processedPage;
        })
      );

      // Step 3: Prepare final data for story creation
      const storyDataToSend = {
        ...formData,
        // Keep formData.image as it is (can be File or null)
        image: formData.image,
        content: JSON.stringify(processedContent), // Content is still stringified
      };

      // Step 4: Create the story using the /api/stories/ endpoint
      toast.info("Hikaye oluşturuluyor...");
      // storyService.createStory will now handle the File object for the cover image
      const response = await storyService.createStory(storyDataToSend);

      toast.success("Hikaye başarıyla oluşturuldu!");
      navigate(`/stories/${response.data.id}`);
    } catch (error) {
      console.error("Hikaye oluşturma hatası:", error);
      // Check for specific validation errors from the backend
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
        toast.error(errorMsg);
      } else {
        toast.error(
          error.message ||
            "Hikaye oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Başlık <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Kategori Seç</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Açıklama <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            rows="3"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Yaş Grubu */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Yaş Grubu
            </label>
            <select
              name="age_group"
              value={formData.age_group}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {ageGroups.map((age) => (
                <option key={age} value={age}>
                  {age === "all" ? "Tüm Yaşlar" : age}
                </option>
              ))}
            </select>
          </div>

          {/* Etiketler */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Etiketler (virgülle ayırın)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="örn: eğitim, çocuk, hayvanlar"
            />
          </div>
        </div>

        {/* Ana Resim */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Kapak Görseli
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100
                dark:file:bg-purple-900 dark:file:text-purple-200
                dark:text-gray-400
                hover:cursor-pointer"
            />
          </div>
          {previewImage && (
            <div className="mt-3 relative">
              <img
                src={previewImage}
                alt="Kapak görseli önizleme"
                className="max-h-48 rounded-md object-contain border border-gray-200 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage(null);
                  setFormData({ ...formData, image: null });
                }}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
          )}
        </div>

        {/* İçerik Editörü */}
        <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md">
          <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            Hikaye İçeriği <span className="text-red-500">*</span>
          </h2>
          <PageEditor pages={formData.content} onChange={handleContentChange} />
          {errors.content && (
            <p className="mt-3 text-sm text-red-500">{errors.content}</p>
          )}
        </div>

        {/* Gönder Butonu */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-md text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 cursor-pointer"
            } shadow-md`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center">
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
                Hikaye Oluşturuluyor...
              </span>
            ) : (
              <span className="flex items-center ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Hikayeyi Oluştur
              </span>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateStoryForm;
