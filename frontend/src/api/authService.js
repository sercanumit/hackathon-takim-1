import apiClient from "./apiClient";

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data containing email, username and password
   * @returns {Promise} Promise with response data
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Login user and get access token
   * @param {Object} credentials - Object with username and password
   * @returns {Promise} Promise with token response
   */
  login: async (credentials) => {
    try {
      // Convert to form data format as required by the API
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response = await apiClient.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Store the token
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user information
   * @returns {Promise} Promise with user data
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logout user by removing token
   */
  logout: () => {
    localStorage.removeItem("access_token");
  },

  /**
   * Check if user is logged in
   * @returns {boolean} True if user has token
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("access_token");
  },
};

/**
 * Standardize error handling
 */
function handleApiError(error) {
  if (error.response) {
    // Server responded with an error status code
    const { status, data } = error.response;

    // Format validation errors
    if (status === 422 && data.detail) {
      const formattedErrors = {};
      data.detail.forEach((err) => {
        // Convert path like ['body', 'username'] to field name
        const field = err.loc[err.loc.length - 1];
        formattedErrors[field] = err.msg;
      });
      return { status, errors: formattedErrors, message: "Validation error" };
    }

    return {
      status,
      message: data.detail || "An error occurred",
      errors: data,
    };
  } else if (error.request) {
    // Request made but no response received
    return { message: "Server did not respond", status: 0 };
  } else {
    // Error setting up the request
    return { message: error.message, status: 0 };
  }
}

export default authService;
