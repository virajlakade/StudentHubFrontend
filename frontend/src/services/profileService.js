import axios from "axios";
import { authService } from "./authService";
import { confessionService } from "./confessionService";
import { lostFoundService } from "./lostFoundService";
import { roommateService } from "./roommateService";

const API = "http://localhost:8090/api/users";

const ACTIVITY_KEY = "studenthub_activities";

export const profileService = {

  // ================= PROFILE =================

  async getProfile() {
    try {

      const currentUser = authService.getCurrentUser();

      if (!currentUser || !currentUser.id) {
        return null;
      }

      const response = await axios.get(`${API}/${currentUser.id}`);

      return response.data;

    } catch (error) {

      console.error("Error fetching profile:", error);
      return null;

    }
  },

  async updateProfile(profile) {

    try {

      const currentUser = authService.getCurrentUser();

      if (!currentUser) {
        throw new Error("User not logged in.");
      }

      const response = await axios.put(
          `${API}/${currentUser.id}`,
          {
            ...currentUser,
            ...profile
          }
      );

      // Update session only (don't send another PUT)
      localStorage.setItem(
          "studenthub_current_user",
          JSON.stringify(response.data)
      );

      window.dispatchEvent(
          new Event("profile-updated")
      );

      this.logActivity(
          "Updated profile information.",
          "profile"
      );

      return response.data;

    } catch (error) {

      console.error(error);
      throw error;

    }

  },

  // ================= MY POSTS =================

  async getMyConfessions() {

    try {

      const profile = await this.getProfile();

      if (!profile) return [];

      const confessions =
          await confessionService.getConfessions();

      return (confessions || []).filter(c =>
          c.email &&
          c.email.toLowerCase() ===
          profile.email.toLowerCase()
      );

    } catch (e) {

      console.error(e);
      return [];

    }

  },

  async getMyLostFoundPosts() {

    try {

      const profile = await this.getProfile();

      if (!profile) return [];

      const items =
          await lostFoundService.getItems();

      return (items || []).filter(item =>
          item.contactEmail &&
          item.contactEmail.toLowerCase() ===
          profile.email.toLowerCase()
      );

    } catch (e) {

      console.error(e);
      return [];

    }

  },

  async getMyRoommatePosts() {

    try {

      const profile = await this.getProfile();

      if (!profile) return [];

      const posts =
          await roommateService.getPosts();

      return (posts || []).filter(post =>
          post.contactEmail &&
          post.contactEmail.toLowerCase() ===
          profile.email.toLowerCase()
      );

    } catch (e) {

      console.error(e);
      return [];

    }

  },

  // ================= ACTIVITY =================

  getActivityTimeline() {

    try {

      return JSON.parse(
          localStorage.getItem(ACTIVITY_KEY) || "[]"
      );

    } catch {

      return [];

    }

  },

  logActivity(text, type = "general") {

    try {

      const activities = JSON.parse(
          localStorage.getItem(ACTIVITY_KEY) || "[]"
      );

      activities.unshift({
        id: Date.now(),
        text,
        type,
        time: new Date().toLocaleString()
      });

      localStorage.setItem(
          ACTIVITY_KEY,
          JSON.stringify(activities)
      );

    } catch (e) {

      console.error(e);

    }

  },

  // ================= CONFESSION TRACKER =================

  trackMyConfession(confessionId) {

    try {

      const KEY = "studenthub_my_confession_ids";

      const ids = JSON.parse(
          localStorage.getItem(KEY) || "[]"
      );

      if (!ids.includes(confessionId)) {

        ids.unshift(confessionId);

        localStorage.setItem(
            KEY,
            JSON.stringify(ids)
        );

      }

    } catch (e) {

      console.error(e);

    }

  }

};

export default profileService;