import { motion } from "framer-motion";

const StoryCover = ({ story, theme, BASE_URL, fullpageApi }) => {
  return (
    <div
      className={`section relative overflow-hidden bg-gradient-to-b ${theme.primary}`}
    >
      {/* Animated background patterns */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.div>

      {/* Kağıt dokusu için overlay */}
      <div className="absolute inset-0 paper-texture opacity-40"></div>

      {/* Enhanced page edges with 3D effect */}
      <div className="absolute right-0 top-0 bottom-0 w-8 paper-fold-right"></div>
      <div className="absolute left-0 top-0 bottom-0 w-8 paper-fold-left"></div>
      <div className="absolute left-0 right-0 bottom-0 h-8 paper-fold-bottom"></div>

      {/* 3D book opening effect */}
      <motion.div
        className="absolute inset-0 bg-black opacity-0"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      />

      {/* Category, Age Group and Tags - Bottom Left */}
      <motion.div
        className="absolute bottom-6 left-10 z-10 flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        {/* Category Badge */}
        <motion.div
          className={`px-5 py-2 rounded-lg shadow-lg bg-gradient-to-r ${theme.secondary} border border-white/20`}
          whileHover={{ scale: 1.05, rotate: 2 }}
        >
          <div className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
            Kategori
          </div>
          <div className="text-white font-bold text-lg">{story.category}</div>
        </motion.div>

        {/* Age Group Badge */}
        <motion.div
          className="bg-white/30 backdrop-blur-md px-5 py-2 rounded-lg border-2 border-white/40 shadow-lg"
          whileHover={{ scale: 1.05, rotate: -2 }}
        >
          <div className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
            Yaş Grubu
          </div>
          <div className="text-white font-bold text-lg">{story.age_group}</div>
        </motion.div>

        {/* Tags moved to bottom left */}
        {story.tags && story.tags.length > 0 && (
          <motion.div
            className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-lg border-2 border-white/30 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <div className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
              Etiketler
            </div>
            <div className="flex flex-wrap gap-2 max-w-xs">
              {story.tags.map((tag) => (
                <motion.span
                  key={tag.id}
                  className="px-2 py-1 bg-white/15 text-white text-xs font-medium rounded-full"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(255,255,255,0.25)",
                  }}
                >
                  {tag.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="container mx-auto px-4 py-12 h-full flex flex-col justify-center items-center relative">
        {/* Decorative book elements */}
        <div className="absolute top-8 left-8">
          <motion.div
            className="w-32 h-1 rounded-full bg-white opacity-70"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 1, delay: 1 }}
          />
        </div>
        <div className="absolute bottom-8 right-8">
          <motion.div
            className="w-32 h-1 rounded-full bg-white opacity-70"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 1, delay: 1 }}
          />
        </div>

        {/* Enhanced title with text effects */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-center mb-12 text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {story.title.split("").map((char, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.03 * idx }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Image and description now in vertical layout */}
        <div className="w-full flex flex-col items-center justify-center max-w-2xl mx-auto mb-12">
          {/* Image */}
          {story.image && (
            <motion.div
              className="w-full max-w-xl mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 relative"
                whileHover={{ scale: 1.03, rotate: 1 }}
              >
                <img
                  src={`${BASE_URL}${story.image}`}
                  alt={story.title}
                  className="w-full h-auto object-cover transform transition-transform"
                />
                {/* Corners decorations */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-white/50 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-white/50 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-white/50 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-white/50 rounded-br-lg" />
              </motion.div>
            </motion.div>
          )}

          {/* Description moved below image */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
              <motion.h3
                className="text-2xl font-semibold text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Konusu
              </motion.h3>
              <motion.p
                className="text-xl text-white/90 italic font-serif leading-relaxed drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {story.description}
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Visual scroll indicator */}
        <motion.div
          className="flex flex-col items-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.p
            className="text-white/80 mb-2 text-sm font-medium"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Kaydırarak Keşfet
          </motion.p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white/80"
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
        </motion.div>
      </div>
    </div>
  );
};

export default StoryCover;
