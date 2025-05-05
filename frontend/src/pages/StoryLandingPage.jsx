import { useState, useEffect, useContext } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import useDarkMode from "../hooks/useDarkMode";
import logoImage from "../assets/yapay_zeka_ve_teknoloji_akademisi_logo.webp";

function StoryLandingPage() {
  const [activeTab, setActiveTab] = useState("çocuklar");
  const [animatedText, setAnimatedText] = useState("");
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const fullText = "Her hikaye bir öğreti, her okuma bir macera!";
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [theme] = useDarkMode();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Text animation effect
  useEffect(() => {
    if (currentCharacter < fullText.length) {
      const timeout = setTimeout(() => {
        setAnimatedText(fullText.substring(0, currentCharacter + 1));
        setCurrentCharacter(currentCharacter + 1);
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [currentCharacter, fullText]);

  // Scroll indicator hide effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featureCards = [
    {
      title: "Eğitici Hikayeler",
      description:
        "Çocuklar için hazırlanmış, eğitici ve öğretici hikayelerle zengin okuma deneyimi.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-purple-600 dark:text-purple-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      bgColor: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-300",
    },
    {
      title: "Duygusal Zeka Gelişimi",
      description:
        "Her hikaye, çocukların empati ve duygusal zekalarını geliştirmek için tasarlandı.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-blue-600 dark:text-blue-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "Değerli Dersler",
      description:
        "Her karar, çocuklara hayat dersleri öğreten sonuçlarıyla eğitici bir deneyim sunar.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600 dark:text-green-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      bgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-300",
    },
  ];

  const floatingBubbleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.2,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 3,
      },
    },
  };

  const heroImageVariants = {
    hidden: { opacity: 0, rotate: -15, y: 20 },
    visible: {
      opacity: 1,
      rotate: [-15, 0],
      y: [20, 0],
      transition: { duration: 1.5 },
    },
  };

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: {
      scale: 1.05,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Enhanced Hero Section */}
      <header className="relative bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-800 dark:via-indigo-700 dark:to-blue-700 overflow-hidden">
        <div className="container mx-auto px-4 py-28 md:py-36 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-200 to-white">
              Çocuklar İçin Özel
              <br />
              Eğitici Hikayeler
            </span>
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-white mb-12 min-h-[40px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {animatedText}
            <span className="animate-blink">|</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.button
              className="group px-8 py-4 bg-yellow-300 hover:bg-yellow-400 text-gray-800 rounded-full font-bold text-lg shadow-lg cursor-pointer"
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center">
                Hikayeleri Keşfet
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </motion.svg>
              </span>
            </motion.button>
            <motion.button
              className="group px-8 py-4 bg-white hover:bg-gray-100 text-gray-800 rounded-full font-bold text-lg shadow-lg cursor-pointer"
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="#how-it-works"
                className="flex items-center justify-center cursor-pointer"
              >
                Tanıtım Videosu
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ y: 0 }}
                  whileHover={{ y: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m0 0l-6-6m6 6l6-6"
                  />
                </motion.svg>
              </a>
            </motion.button>
          </motion.div>

          {/* Scroll down indicator */}
          {showScrollIndicator && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: showScrollIndicator ? 0.8 : 0 }}
              transition={{ delay: 1.5 }}
              whileInView={{
                y: [0, 10, 0],
                transition: {
                  y: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  },
                },
              }}
            >
              <p className="text-white mb-2">Keşfet</p>
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
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          )}
        </div>
      </header>

      {/* Interactive Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-300">
              Çocuklarınız İçin Özel Tasarlandı
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md"
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                whileHover="hover"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.2 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  className={`w-20 h-20 ${card.bgColor} rounded-full flex items-center justify-center mb-6`}
                  whileHover={{ rotate: 12 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {card.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 bg-white dark:bg-gray-900 overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 dark:text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="relative">
              Nasıl Çalışır?
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true, amount: 0.8 }}
              />
            </span>
          </motion.h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow-lg relative">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden relative">
                  {isVideoPlaying ? (
                    <iframe
                      className="w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="İnteraktif Hikaye Tanıtımı"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div
                      className="video-overlay w-full h-full bg-purple-600 rounded-lg flex items-center justify-center cursor-pointer"
                      onClick={() => setIsVideoPlaying(true)}
                      style={{
                        backgroundImage:
                          "url('https://placehold.co/600x400/9333EA/FFFFFF/png?text=İnteraktif+Hikaye+Videosu')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="play-button bg-white/80 dark:bg-black/50 p-6 rounded-full hover:scale-110 transition-transform">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-purple-600 dark:text-purple-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="w-full md:w-1/2 space-y-8">
              {[1, 2, 3].map((step, index) => (
                <motion.div
                  key={step}
                  className="flex items-start group"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <motion.div
                    className="bg-purple-100 dark:bg-purple-900 rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0 mr-6"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-purple-600 dark:text-purple-300 font-bold text-xl">
                      {step}
                    </span>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {step === 1
                        ? "Hikayeyi Seç"
                        : step === 2
                        ? "Hikayeyi Oku"
                        : "Dersler Öğren"}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {step === 1
                        ? "Yaş grubuna ve ilgi alanına göre birçok hikaye arasından seçim yap. Kahramanlarla tanış ve maceraya başla!"
                        : step === 2
                        ? "Hikayenin akışında ilerle ve ilgi çekici karakterlerle tanış. Her hikaye özenle hazırlanmış içerikler sunar!"
                        : "Her hikayeden değerli dersler ve hayat becerileri kazandıran içeriklerle karşılaş. Eğlenerek öğren!"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Kids and Parents */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Hem Çocuklar Hem Ebeveynler İçin
          </motion.h2>

          <motion.div
            className="flex justify-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="inline-flex rounded-full shadow-lg overflow-hidden p-1 bg-white dark:bg-gray-700">
              <motion.button
                onClick={() => setActiveTab("çocuklar")}
                className={`px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 cursor-pointer ${
                  activeTab === "çocuklar"
                    ? "bg-purple-600 text-white shadow-inner"
                    : "bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                Çocuklar
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("ebeveynler")}
                className={`px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 cursor-pointer ${
                  activeTab === "ebeveynler"
                    ? "bg-purple-600 text-white shadow-inner"
                    : "bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                Ebeveynler
              </motion.button>
            </div>
          </motion.div>

          <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "çocuklar" ? (
                <motion.div
                  className="flex flex-col md:flex-row"
                  key="çocuklar"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="w-full md:w-1/2 p-10">
                    <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                      Çocuklar İçin
                    </h3>
                    <ul className="space-y-5">
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg text-gray-600 dark:text-gray-300">
                          Eğlenceli ve sürükleyici hikayelerle okuma alışkanlığı
                          kazandırır
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg text-gray-600 dark:text-gray-300">
                          Okuma becerilerini güçlendirir
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg text-gray-600 dark:text-gray-300">
                          Empati ve duygusal zekayı geliştirir
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg text-gray-600 dark:text-gray-300">
                          Hayal gücünü ve yaratıcılığı artırır
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="w-full md:w-1/2">
                    <img
                      src="https://placehold.co/600x400/6D28D9/FFFFFF/png?text=Çocuklar+İçin"
                      alt="Çocuklar için uygulama"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-col md:flex-row"
                  key="ebeveynler"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="w-full md:w-1/2">
                    <img
                      src="https://placehold.co/600x400/6D28D9/FFFFFF/png?text=Ebeveynler+İçin"
                      alt="Ebeveynler için dashboard"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full md:w-1/2 p-10">
                    <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                      Ebeveynler İçin
                    </h3>
                    <ul className="space-y-5">
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg text-gray-600 dark:text-gray-300">
                          Çocuğunuzun değerlerini ve karar mekanizmalarını görün
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg text-gray-600 dark:text-gray-300">
                          Gelişimini takip edin
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg text-gray-600 dark:text-gray-300">
                          Çocuğunuzla derin konuşmalar için fırsatlar yakalayın
                        </span>
                      </li>
                      <li className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-lg text-gray-600 dark:text-gray-300">
                          Yaşına ve değerlerine uygun hikayeler önerin
                        </span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 overflow-hidden">
        <motion.div
          className="container mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Hikaye Yolculuğuna Hemen Başlayın!
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Tamamen ücretsiz, sınırsız hikaye erişimi ile çocuğunuzun gelişimine
            katkıda bulunun.
            <span className="block mt-2 font-light">Hemen şimdi başlayın!</span>
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <motion.button
              className="group px-10 py-4 bg-yellow-300 hover:bg-yellow-400 text-gray-800 rounded-full font-bold text-xl shadow-lg cursor-pointer"
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center">
                Hemen Başla
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </motion.svg>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-purple-600 dark:text-purple-400">
                İnteraktif Hikayeler
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Bu proje, hackathon için geliştirilmiş kâr amacı gütmeyen bir
                girişimdir. Amacımız çocuklar için eğitici ve eğlenceli
                hikayeler sunarak yeteneklerimizi sergilemektir.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                Takım Üyeleri
              </h4>
              <ul className="space-y-3">
                <li className="text-gray-600 dark:text-gray-400 text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Ali Nebi ER</span>
                </li>
                <li className="text-gray-600 dark:text-gray-400 text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Aybüke BOZKURT</span>
                </li>
                <li className="text-gray-600 dark:text-gray-400 text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Sercan Ümit ÖNER</span>
                </li>
                <li className="text-gray-600 dark:text-gray-400 text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Süveyda Ezgi ŞAN</span>
                </li>
                <li className="text-gray-600 dark:text-gray-400 text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Zeynep Ravza DURSUN</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                Proje Bilgileri
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com/sercanumit/hackathon-takim-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-lg cursor-pointer flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub Repo
                  </a>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    MIT Lisansı
                  </span>
                </li>
                <li className="flex items-start">
                  <img
                    src={logoImage}
                    alt="Yapay Zeka Ve Teknoloji Akademisi Logo"
                    className="h-6 w-6 mr-2 flex-shrink-0 mt-1"
                  />
                  <a
                    href="https://yapayzekaveteknolojiakademisi.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-lg cursor-pointer flex items-center"
                  >
                    Yapay Zeka ve Teknoloji Akademisi
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p className="text-lg">
              © Hackathon Takım 1 | MIT Lisansı altında dağıtılmaktadır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StoryLandingPage;
