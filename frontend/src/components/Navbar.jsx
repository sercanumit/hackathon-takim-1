import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Navbar({
  theme,
  toggleTheme,
  isAuthenticated,
  logout,
  user,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 relative z-20">
      <div className="container mx-auto px-4 py-3 md:py-4">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="font-bold text-xl md:text-2xl text-purple-600 dark:text-purple-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/">İnteraktif Hikayeler</Link>
          </motion.div>

          {/* Center Nav Links - Desktop */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Ana Sayfa
            </Link>
            <Link
              to="/stories"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              Hikayeler
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <motion.button
              onClick={toggleTheme}
              className="hidden md:flex p-2 rounded-full bg-gray-200 hover:cursor-pointer dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              aria-label="Tema değiştir"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === "light" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </motion.button>

            {/* Authentication Controls - Desktop */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="relative group">
                  <motion.div
                    className="flex items-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-full py-1.5 px-3 shadow-sm cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-purple-500 dark:bg-purple-600 rounded-full w-7 h-7 flex items-center justify-center text-white font-medium">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <span className="ml-2 text-gray-700 dark:text-gray-200 font-medium">
                      {user?.username}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Ana Sayfa
                      </Link>
                      <Link
                        to="/stories"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Hikayeler
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md shadow-sm font-medium flex items-center"
                  >
                    Giriş Yap
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden absolute inset-x-0 top-full bg-white dark:bg-gray-800 shadow-md z-10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2 px-4 space-y-2">
                <Link
                  to="/"
                  className="block py-2 text-gray-700 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
                <Link
                  to="/stories"
                  className="block py-2 text-gray-700 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hikayeler
                </Link>

                {/* Theme Toggle in Mobile Menu */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between w-full py-3 px-3 mt-2 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
                >
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {theme === "dark" ? "Açık Tema" : "Koyu Tema"}
                  </span>
                  <div className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
                    {theme === "light" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-700 dark:text-gray-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-700 dark:text-gray-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>

                {isAuthenticated ? (
                  <>
                    <div className="py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                      <div className="flex items-center space-x-3 py-2">
                        <div className="bg-purple-500 dark:bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-medium">
                          {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">
                            {user?.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="mt-2 w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-left"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-3 flex flex-col space-y-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <Link
                      to="/login"
                      className="py-2 px-4 bg-purple-600 text-white rounded-md text-center font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      to="/register"
                      className="py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
