import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useDarkMode from "./hooks/useDarkMode";
import { useAuth } from "./context/AuthContext";
import StoryLandingPage from "./pages/StoryLandingPage";
import StoryGalleryPage from "./pages/StoryGalleryPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PopularStoriesPage from "./pages/PopularStoriesPage";

function App() {
  const [theme, toggleTheme] = useDarkMode();
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          isAuthenticated={isAuthenticated}
          logout={logout}
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <Routes>
          <Route path="/" element={<StoryLandingPage />} />
          <Route
            path="/stories"
            element={
              <ProtectedRoute>
                <StoryGalleryPage />
              </ProtectedRoute>
            }
          />
          <Route path="/stories/popular" element={<PopularStoriesPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
