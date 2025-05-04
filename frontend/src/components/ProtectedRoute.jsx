import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state if auth is being checked
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <motion.div
          className="h-16 w-16 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
}

export default ProtectedRoute;
