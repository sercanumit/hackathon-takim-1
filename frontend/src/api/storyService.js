import apiClient from "./apiClient";

/**
 * Service for interacting with story-related API endpoints
 */
const storyService = {
  /**
   * Create a new story
   * @param {Object} storyData - The story data, including a JSON string for content and potentially a File for image
   * @returns {Promise} - Promise with API response
   */
  createStory: async (storyData) => {
    const formData = new FormData();

    formData.append("title", storyData.title);
    formData.append("description", storyData.description);
    formData.append("category", storyData.category);

    // hazırlanmadığı için şuanlık kapalı
    // if (storyData.is_interactive !== undefined) {
    //   formData.append("is_interactive", String(storyData.is_interactive));
    // }

    if (storyData.age_group) {
      formData.append("age_group", storyData.age_group);
    }

    if (storyData.tags) {
      formData.append("tags", storyData.tags);
    }

    if (storyData.image instanceof File) {
      formData.append("image", storyData.image);
    }

    if (storyData.content) {
      formData.append("content", storyData.content);
    }

    return await apiClient.post("/api/stories/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Upload an image for a story
   * @param {File} imageFile - The image file to upload
   * @returns {Promise} - Promise with API response
   */
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    return await apiClient.post("/api/stories/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Get featured stories
   * @param {number} limit - Maximum number of stories to return
   * @returns {Promise} - Promise with API response
   */
  getFeaturedStories: async (limit = 10) => {
    return await apiClient.get("/api/stories/featured", {
      params: { limit },
    });
  },

  /**
   * Get new stories
   * @param {number} limit - Maximum number of stories to return
   * @returns {Promise} - Promise with API response
   */
  getNewStories: async (limit = 10) => {
    return await apiClient.get("/api/stories/new", {
      params: { limit },
    });
  },

  /**
   * Get popular stories
   * @param {number} limit - Maximum number of stories to return
   * @returns {Promise} - Promise with API response
   */
  getPopularStories: async (limit = 10) => {
    return await apiClient.get("/api/stories/popular", {
      params: { limit },
    });
  },

  /**
   * Get story details
   * @param {number} storyId - ID of the story to retrieve
   * @returns {Promise} - Promise with API response
   */
  getStoryDetail: async (storyId) => {
    return await apiClient.get(`/api/stories/${storyId}`);
  },

  /**
   * Update a story
   * @param {number} storyId - ID of the story to update
   * @param {Object} storyData - The updated story data
   * @returns {Promise} - Promise with API response
   */
  updateStory: async (storyId, storyData) => {
    const formData = new FormData();

    if (storyData.title) formData.append("title", storyData.title);
    if (storyData.description)
      formData.append("description", storyData.description);
    if (storyData.category) formData.append("category", storyData.category);
    if (storyData.image) formData.append("image", storyData.image);

    return await apiClient.put(`/api/stories/${storyId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Like a story
   * @param {number} storyId - ID of the story to like
   * @returns {Promise} - Promise with API response
   */
  likeStory: async (storyId) => {
    return await apiClient.post(`/api/stories/${storyId}/like`);
  },

  /**
   * Dislike a story
   * @param {number} storyId - ID of the story to dislike
   * @returns {Promise} - Promise with API response
   */
  dislikeStory: async (storyId) => {
    return await apiClient.post(`/api/stories/${storyId}/dislike`);
  },

  /**
   * Filter stories by criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise} - Promise with API response
   */
  filterStories: async (filters = {}) => {
    return await apiClient.get("/api/stories/filter", {
      params: filters,
    });
  },

  /**
   * Delete a story
   * @param {number} storyId - ID of the story to delete
   * @returns {Promise} - Promise with API response
   */
  deleteStory: async (storyId) => {
    return await apiClient.delete(`/api/stories/${storyId}`);
  },

  /**
   * Generate a story using AI
   * @param {string} userPrompt - The user's prompt for story generation
   * @param {string} category - The category of the story
   * @returns {Promise} - Promise with API response
   */
  generateAIStory: async (userPrompt, category) => {
    return await apiClient.post("/api/stories/ai-generate", {
      user_prompt: userPrompt,
      category: category,
    });
  },
};

export default storyService;
