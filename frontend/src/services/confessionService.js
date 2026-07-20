import { api } from "./authService";
import { profileService } from "./profileService";

const API = "/api";

const getCurrentUser = async () => {
  try {
    // Try profile service first
    const profile = await profileService.getProfile();

    if (profile && profile.id) {
      return profile;
    }
  } catch (e) {
    console.log("Profile service unavailable, using localStorage.");
  }

  // Fallback to localStorage
  try {
    const storedUser = localStorage.getItem("studenthub_user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user && user.id) {
        return user;
      }
    }
  } catch (e) {
    console.error("Error reading local user:", e);
  }

  return null;
};

export const confessionService = {

  // ================= GET ALL =================

  async getConfessions() {
    try {
      const response = await api.get(`${API}/confessions`);

      console.log("Confessions Response:", response.data);

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (Array.isArray(response.data?.content)) {
        return response.data.content;
      }

      return [];

    } catch (error) {
      console.error("Error fetching confessions:", error);
      return [];
    }
  },

  // ================= GET BY ID =================

  async getConfessionById(id) {
    try {
      const response = await api.get(`${API}/confessions/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // ================= CREATE =================

  async addConfession(text, category) {

    const user = await getCurrentUser();

    if (!user) {
      alert("Please login before posting a confession.");
      return null;
    }

    try {

      const payload = {
        title: category,
        message: text,
        category: category,
        likes: 0,
        userId: user.id
      };

      console.log("Sending Confession:", payload);

      const response = await api.post(
          `${API}/confessions`,
          payload
      );

      try {
        profileService.trackMyConfession(response.data.id);
      } catch (e) {}

      try {
        profileService.logActivity(
            `Posted confession in "${category}".`,
            "confession"
        );
      } catch (e) {}

      return response.data;

    } catch (error) {
      console.error("Error creating confession:", error);

      if (error.response) {
        console.error(error.response.data);
      }

      return null;
    }
  },

  // ================= LIKE =================

  async likeConfession(id) {
    try {
      const response = await api.put(
          `${API}/confessions/${id}/like`
      );

      return response.data;

    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // ================= COMMENTS =================

  async getComments(confessionId) {

    try {

      const response = await api.get(
          `${API}/comments/${confessionId}`
      );

      return Array.isArray(response.data)
          ? response.data
          : [];

    } catch (error) {

      console.error(error);
      return [];

    }

  },

  async addComment(confessionId, commentText) {

    try {

      const response = await api.post(
          `${API}/comments/${confessionId}`,
          {
            commentText
          }
      );

      try {
        profileService.logActivity(
            "Added a confession comment.",
            "confession"
        );
      } catch (e) {}

      return response.data;

    } catch (error) {

      console.error(error);

      return null;

    }

  }

};

export default confessionService;