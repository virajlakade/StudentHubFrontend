import { api } from "./authService";
import { profileService } from "./profileService";

const API = "/api";

const getCurrentUser = async () => {
  try {
    const profile = await profileService.getProfile();

    if (profile && profile.id) {
      return profile;
    }
  } catch (e) {
    console.log("Profile service unavailable, using localStorage.");
  }

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
    const response = await api.get(`${API}/confessions`);

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.data?.content)) {
      return response.data.content;
    }

    return [];
  },

  // ================= GET BY ID =================

  async getConfessionById(id) {
    const response = await api.get(`${API}/confessions/${id}`);
    return response.data;
  },

  // ================= CREATE =================

  async addConfession(text, category) {

    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Please login before posting a confession.");
    }

    const payload = {
      title: category,
      message: text,
      category: category,
      likes: 0,
      userId: user.id
    };

    const response = await api.post(
        `${API}/confessions`,
        payload
    );

    try {
      await profileService.trackMyConfession(response.data.id);
    } catch (e) {}

    try {
      await profileService.logActivity(
          `Posted confession in "${category}".`,
          "confession"
      );
    } catch (e) {}

    return response.data;
  },

  // ================= LIKE =================

  async likeConfession(id) {

    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Please login first.");
    }

    const response = await api.put(
        `${API}/confessions/${id}/like`
    );

    return response.data;
  },

  // ================= COMMENTS =================

  async getComments(confessionId) {

    const response = await api.get(
        `${API}/comments/${confessionId}`
    );

    return Array.isArray(response.data)
        ? response.data
        : [];
  },

  async addComment(confessionId, commentText) {

    const response = await api.post(
        `${API}/comments/${confessionId}`,
        {
          commentText
        }
    );

    try {
      await profileService.logActivity(
          "Added a confession comment.",
          "confession"
      );
    } catch (e) {}

    return response.data;
  }

};

export default confessionService;