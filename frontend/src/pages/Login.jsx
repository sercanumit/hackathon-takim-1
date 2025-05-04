import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [theme] = useDarkMode();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // yazarken hata mesajını kaldır
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Kullanıcı adı gerekli";
    }

    if (!formData.password) {
      newErrors.password = "Şifre gerekli";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        username: formData.username,
        password: formData.password,
      });

      setSubmitSuccess(true);

      // Redirect after successful login to Stories page instead of home page
      setTimeout(() => {
        navigate("/stories");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);

      // Handle API validation errors
      if (error.errors) {
        setErrors((prev) => ({
          ...prev,
          ...error.errors,
          // Add generic error if needed
          general: error.message || "Login failed. Please try again.",
        }));
      } else {
        setErrors({
          general: error.message || "Login failed. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Framer Motion variants
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    tap: { scale: 0.95 },
    loading: {
      scale: [1, 1.03, 1],
      transition: {
        repeat: Infinity,
        duration: 1,
      },
    },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <motion.div
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg relative z-10"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <motion.div variants={itemVariants} className="text-center">
          <motion.h1
            className="text-3xl font-extrabold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tekrar Hoşgeldin!
          </motion.h1>
          <motion.p
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Seni tekrar görmek harika! Hikaye macerana kaldığın yerden devam et.
          </motion.p>
        </motion.div>

        {submitSuccess ? (
          <motion.div
            className="bg-green-100 dark:bg-green-900 p-6 rounded-lg text-center"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="text-green-600 dark:text-green-400 text-5xl mb-4 flex justify-center"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 0.6 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
              Giriş Başarılı!
            </h3>
            <p className="text-green-600 dark:text-green-400 mt-2">
              Macerana kaldığın yerden devam etmeye hazırsın.
            </p>
          </motion.div>
        ) : (
          <motion.form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            variants={formVariants}
          >
            <div className="space-y-4">
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Kullanıcı Adı
                </label>
                <div className="mt-1 relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-3 py-3 border ${
                      errors.username
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    } placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                    placeholder="Kullanıcı adınız"
                  />
                  {errors.username && (
                    <motion.p
                      className="mt-2 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.username}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Şifre
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-3 py-3 border ${
                      errors.password
                        ? "border-red-300 dark:border-red-700"
                        : "border-gray-300 dark:border-gray-600"
                    } placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                    placeholder="Şifreniz"
                  />
                  {errors.password && (
                    <motion.p
                      className="mt-2 text-sm text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Beni hatırla
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Şifreni mi unuttun?
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                animate={isSubmitting ? "loading" : "idle"}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
                    Giriş Yapılıyor...
                  </span>
                ) : (
                  <span className="group-hover:translate-x-1 transition-transform">
                    Giriş Yap
                    <motion.span
                      className="absolute right-4 opacity-0 group-hover:opacity-100"
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                    >
                      →
                    </motion.span>
                  </span>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        )}

        <motion.div
          className="flex items-center justify-center mt-6"
          variants={itemVariants}
        >
          <div className="text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Hesabın yok mu?{" "}
              <Link
                to="/register"
                className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Kayıt Ol
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Background decoration */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 dark:opacity-70 animate-blob"></div>
      <div className="absolute bottom-40 left-20 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 dark:opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 dark:opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  );
}

export default Login;
