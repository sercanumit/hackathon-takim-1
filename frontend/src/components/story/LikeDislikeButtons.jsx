import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import storyService from "../../api/storyService";
import { useNavigate } from "react-router-dom";

const LikeDislikeButtons = ({ storyId, theme }) => {
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setLikeActive(true);

    try {
      await storyService.likeStory(storyId);
      toast.success("Geri bildiriminiz kaydedildi");
    } catch (error) {
      console.error("Error liking story:", error);
      toast.error("Geri bildiriminiz kaydedilirken bir hata oluştu");
    } finally {
      setTimeout(() => {
        setLikeActive(false);
        setIsSubmitting(false);
        navigate("/stories");
      }, 1500);
    }
  };

  const handleDislike = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setDislikeActive(true);

    try {
      await storyService.dislikeStory(storyId);
      toast.success("Geri bildiriminiz kaydedildi");
    } catch (error) {
      console.error("Error disliking story:", error);
      toast.error("Geri bildiriminiz kaydedilirken bir hata oluştu");
    } finally {
      setTimeout(() => {
        setDislikeActive(false);
        setIsSubmitting(false);
        navigate("/stories");
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Bu hikayeyi nasıl buldunuz?
      </h3>
      <div className="flex flex-row gap-8 md:gap-12 justify-center w-full">
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(52, 211, 153, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: likeActive ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
          onClick={handleLike}
          disabled={isSubmitting}
          className={`flex flex-col items-center justify-center px-6 py-4 md:px-8 md:py-6 rounded-xl 
                    ${
                      likeActive
                        ? "bg-green-500 text-white"
                        : "bg-white dark:bg-gray-800"
                    } 
                    shadow-lg border-2 ${
                      likeActive
                        ? "border-green-600"
                        : "border-gray-200 dark:border-gray-700"
                    } 
                    transition-all`}
          aria-label="Like this story"
        >
          <motion.div
            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-3
                      ${
                        likeActive
                          ? "text-white"
                          : "text-green-500 dark:text-green-400"
                      }`}
            animate={{
              rotate: likeActive ? [0, -15, 15, -15, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
            </svg>
          </motion.div>
          <span
            className={`font-bold text-lg md:text-xl ${
              likeActive ? "text-white" : "text-gray-800 dark:text-white"
            }`}
          >
            Beğendim
          </span>
          {likeActive && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-green-500 -z-10 opacity-20"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 1 }}
            />
          )}
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(248, 113, 113, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: dislikeActive ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
          onClick={handleDislike}
          disabled={isSubmitting}
          className={`flex flex-col items-center justify-center px-6 py-4 md:px-8 md:py-6 rounded-xl 
                    ${
                      dislikeActive
                        ? "bg-red-500 text-white"
                        : "bg-white dark:bg-gray-800"
                    } 
                    shadow-lg border-2 ${
                      dislikeActive
                        ? "border-red-600"
                        : "border-gray-200 dark:border-gray-700"
                    } 
                    transition-all`}
          aria-label="Dislike this story"
        >
          <motion.div
            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-3
                      ${
                        dislikeActive
                          ? "text-white"
                          : "text-red-500 dark:text-red-400"
                      }`}
            animate={{
              rotate: dislikeActive ? [0, 15, -15, 15, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
            </svg>
          </motion.div>
          <span
            className={`font-bold text-lg md:text-xl ${
              dislikeActive ? "text-white" : "text-gray-800 dark:text-white"
            }`}
          >
            Beğenmedim
          </span>
          {dislikeActive && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-red-500 -z-10 opacity-20"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 1 }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default LikeDislikeButtons;
