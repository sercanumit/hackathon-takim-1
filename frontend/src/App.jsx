import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import NewStoriesPage from "./pages/NewStoriesPage";
import CreateStoryPage from "./pages/CreateStoryPage";
import StoryFullPage from "./pages/StoryFullPage";
import AIStoryGenerationPage from "./pages/AIStoryGenerationPage";

// Helper component to conditionally render Navbar
const NavbarWrapper = ({
  children,
  theme,
  toggleTheme,
  isAuthenticated,
  logout,
  user,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const location = useLocation();
  const isStoryReadPage =
    location.pathname.includes("/stories/") &&
    location.pathname.includes("/read");

  return (
    <>
      {!isStoryReadPage && (
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          isAuthenticated={isAuthenticated}
          logout={logout}
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
      {children}
    </>
  );
};

function App() {
  const [theme, toggleTheme] = useDarkMode();
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar
                  theme={theme}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  user={user}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <StoryLandingPage />
              </>
            }
          />
          <Route
            path="/stories"
            element={
              <>
                <Navbar
                  theme={theme}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  user={user}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <ProtectedRoute>
                  <StoryGalleryPage />
                </ProtectedRoute>
              </>
            }
          />
          <Route
            path="/stories/popular"
            element={
              <>
                <Navbar
                  theme={theme}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  user={user}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <PopularStoriesPage />
              </>
            }
          />
          <Route
            path="/stories/new"
            element={
              <>
                <Navbar
                  theme={theme}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  user={user}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <NewStoriesPage />
              </>
            }
          />
          <Route
            path="/stories/create"
            element={
              <>
                <Navbar
                  theme={theme}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  user={user}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <ProtectedRoute>
                  <CreateStoryPage />
                </ProtectedRoute>
              </>
            }
          />
          <Route path="/stories/:id" element={<StoryFullPage />} />
          <Route
            path="/stories/ai-generate"
            element={
              <>
                <Navbar
                  theme={theme}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  user={user}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <ProtectedRoute>
                  <AIStoryGenerationPage />
                </ProtectedRoute>
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar
                  theme={theme}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  user={user}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <Register />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar
                  theme={theme}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  logout={logout}
                  user={user}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
                <Login />
              </>
            }
          />
        </Routes>
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
