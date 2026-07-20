import authService, { api, USER_KEY } from "./authService";
import { confessionService } from "./confessionService";
import { lostFoundService } from "./lostFoundService";
import { roommateService } from "./roommateService";

const ACTIVITY_KEY = "studenthub_activities";
const MY_CONFESSION_KEY = "studenthub_my_confession_ids";

export const profileService = {

  // ================= PROFILE =================

  async getProfile() {
    try {
      const currentUser = authService.getCurrentUser();

      if (!currentUser?.id) {
        return null;
      }

      const response = await api.get(`/api/users/${currentUser.id}`);

      localStorage.setItem(
          USER_KEY,
          JSON.stringify(response.data)
      );

      return response.data;

    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  },

  async updateProfile(profile) {
    try {
      const currentUser = authService.getCurrentUser();

      if (!currentUser?.id) {
        throw new Error("User not logged in.");
      }

      const response = await api.put(
          `/api/users/${currentUser.id}`,
          {
            ...currentUser,
            ...profile,
          }
      );

      localStorage.setItem(
          USER_KEY,
          JSON.stringify(response.data)
      );

      window.dispatchEvent(new Event("profile-updated"));

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

  // ================= MY CONFESSIONS =================

  async getMyConfessions() {

    const profile = await this.getProfile();

    if (!profile) return [];

    const confessions =
        await confessionService.getConfessions();

    return (confessions || []).filter(
        confession =>
            confession.email &&
            confession.email.toLowerCase() ===
            profile.email.toLowerCase()
    );
  },

  // ================= LOST & FOUND =================

  async getMyLostFoundPosts() {

    const profile = await this.getProfile();

    if (!profile) return [];

    const items =
        await lostFoundService.getItems();

    return (items || []).filter(
        item =>
            item.contactEmail &&
            item.contactEmail.toLowerCase() ===
            profile.email.toLowerCase()
    );
  },

  // ================= ROOMMATE =================

  async getMyRoommatePosts() {

    const profile = await this.getProfile();

    if (!profile) return [];

    const posts =
        await roommateService.getPosts();

    return (posts || []).filter(
        post =>
            post.contactEmail &&
            post.contactEmail.toLowerCase() ===
            profile.email.toLowerCase()
    );
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
        time: new Date().toLocaleString(),
      });

      localStorage.setItem(
          ACTIVITY_KEY,
          JSON.stringify(activities)
      );

    } catch (e) {
      console.error(e);
    }
  },

  // ================= MY CONFESSION IDS =================

  trackMyConfession(confessionId) {

    try {

      const ids = JSON.parse(
          localStorage.getItem(MY_CONFESSION_KEY) || "[]"
      );

      if (!ids.includes(confessionId)) {

        ids.unshift(confessionId);

        localStorage.setItem(
            MY_CONFESSION_KEY,
            JSON.stringify(ids)
        );
      }

    } catch (e) {
      console.error(e);
    }
  },

};

export default profileService;