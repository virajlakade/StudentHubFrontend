import axios from "axios";
import { profileService } from "./profileService";

const API = "http://localhost:8090/api";

export const confessionService = {

  // ================= GET ALL =================

  async getConfessions() {

    try {

      const response = await axios.get(`${API}/confessions`);

      console.log("Confessions Response:", response.data);

      return Array.isArray(response.data)
          ? response.data
          : response.data.content || [];

    } catch (error) {

      console.error("Error fetching confessions:", error);

      return [];

    }

  },

  // ================= GET BY ID =================

  async getConfessionById(id) {

    try {

      const response = await axios.get(
          `${API}/confessions/${id}`
      );

      return response.data;

    } catch (error) {

      console.error(error);

      return null;

    }

  },

  // ================= CREATE =================

  async addConfession(text, category) {

    try {

      const profile = await profileService.getProfile();

      const payload = {
        title: category,
        message: text,
        category,
        likes: 0,

        userId: profile?.id
      };

      console.log("Confession Payload:", payload);

      const response = await axios.post(
          `${API}/confessions`,
          payload
      );

      profileService.trackMyConfession(
          response.data.id
      );

      profileService.logActivity(
          `Posted confession in "${category}".`,
          "confession"
      );

      return response.data;

    } catch (error) {

      console.error(error);

      return null;

    }

  },

  // ================= LIKE =================

  async likeConfession(id) {

    try {

      const response = await axios.put(
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

      const response = await axios.get(
          `${API}/comments/${confessionId}`
      );

      return response.data;

    } catch (error) {

      console.error(error);

      return [];

    }

  },

  async addComment(confessionId, commentText) {

    try {

      const response = await axios.post(
          `${API}/comments/${confessionId}`,
          {
            commentText
          }
      );

      profileService.logActivity(
          "Added a confession comment.",
          "confession"
      );

      return response.data;

    } catch (error) {

      console.error(error);

      return null;

    }

  }

};

export default confessionService;