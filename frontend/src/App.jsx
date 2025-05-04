import useDarkMode from "./hooks/useDarkMode";

function App() {
  const [theme, toggleTheme] = useDarkMode();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold underline text-center text-gray-900 dark:text-white">
          tailwindcss?
        </h1>
        <div className="flex justify-center mt-4">
          <button
            onClick={toggleTheme} // Tema değiştirme fonksiyonunu çağır
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-300"
          >
            Toggle Theme ({theme === "light" ? "Dark" : "Light"})
          </button>
        </div>
        {/* Diğer bileşenler buraya eklenebilir */}
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-700 dark:text-gray-300">
            Mevcut tema: {theme}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
