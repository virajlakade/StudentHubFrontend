import { INITIAL_PROFILE } from "../data/profileData";
import { lostFoundService } from "./lostFoundService";
import { confessionService } from "./confessionService";
import { roommateService } from "./roommateService";
import { authService } from "./authService";

const PROFILE_KEY = "studenthub_profile";
const ACTIVITIES_KEY = "studenthub_activities";
const MY_CONFESSIONS_IDS_KEY = "studenthub_my_confession_ids";

const DEFAULT_ACTIVITIES = [
  {
    id: "act-1",
    text: "Joined StudentHub portal.",
    time: "5 days ago",
    type: "system"
  },
  {
    id: "act-2",
    text: "Verified institutional email address.",
    time: "4 days ago",
    type: "system"
  },
  {
    id: "act-3",
    text: "Updated skills tags in profile.",
    time: "3 days ago",
    type: "profile"
  }
];

const initStorage = () => {
  if (!localStorage.getItem(PROFILE_KEY)) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(INITIAL_PROFILE));
  }

  if (!localStorage.getItem(ACTIVITIES_KEY)) {
    localStorage.setItem(
        ACTIVITIES_KEY,
        JSON.stringify(DEFAULT_ACTIVITIES)
    );
  }

  if (!localStorage.getItem(MY_CONFESSIONS_IDS_KEY)) {
    localStorage.setItem(
        MY_CONFESSIONS_IDS_KEY,
        JSON.stringify([])
    );
  }
};

export const profileService = {

  getProfile() {

    initStorage();

    try {

      const authUser = authService.getCurrentUser();

      if (authUser) return authUser;

      return JSON.parse(localStorage.getItem(PROFILE_KEY)) || INITIAL_PROFILE;

    } catch (e) {

      console.error(e);
      return INITIAL_PROFILE;

    }

  },

  updateProfile(updatedProfile) {

    initStorage();

    authService.updateSessionProfile(updatedProfile);

    profileService.logActivity(
        "Updated profile details.",
        "profile"
    );

    return updatedProfile;

  },

  trackMyConfession(confessionId) {

    initStorage();

    const ids =
        JSON.parse(localStorage.getItem(MY_CONFESSIONS_IDS_KEY)) || [];

    if (!ids.includes(confessionId)) {

      ids.unshift(confessionId);

      localStorage.setItem(
          MY_CONFESSIONS_IDS_KEY,
          JSON.stringify(ids)
      );

    }

  },

  async getMyConfessions() {

    try {

      const ids =
          JSON.parse(localStorage.getItem(MY_CONFESSIONS_IDS_KEY)) || [];

      const confessions =
          await confessionService.getConfessions();

      return (Array.isArray(confessions) ? confessions : []).filter(
          confession => ids.includes(confession.id)
      );

    } catch (e) {

      console.error("Error reading my confessions", e);
      return [];

    }

  },

  async getMyLostFoundPosts() {

    try {

      const profile = profileService.getProfile();

      const items =
          await lostFoundService.getItems();

      return (Array.isArray(items) ? items : []).filter(item =>
          item.contactEmail &&
          profile.email &&
          item.contactEmail.toLowerCase().trim() ===
          profile.email.toLowerCase().trim()
      );

    } catch (e) {

      console.error("Error reading LostFound", e);
      return [];

    }

  },

  async getMyRoommatePosts() {

    try {

      const profile = profileService.getProfile();

      const posts =
          await roommateService.getPosts();

      return (Array.isArray(posts) ? posts : []).filter(post =>
          post.contactEmail &&
          profile.email &&
          post.contactEmail.toLowerCase().trim() ===
          profile.email.toLowerCase().trim()
      );

    } catch (e) {

      console.error("Error reading roommate posts", e);
      return [];

    }

  },

  getActivityTimeline() {

    initStorage();

    try {

      return JSON.parse(localStorage.getItem(ACTIVITIES_KEY)) || [];

    } catch (e) {

      console.error(e);
      return DEFAULT_ACTIVITIES;

    }

  },

  logActivity(text, type = "general") {

    initStorage();

    try {

      const list =
          JSON.parse(localStorage.getItem(ACTIVITIES_KEY)) || [];

      const activity = {
        id: `act-${Date.now()}`,
        text,
        time: "Just now",
        type
      };

      list.unshift(activity);

      localStorage.setItem(
          ACTIVITIES_KEY,
          JSON.stringify(list)
      );

      return activity;

    } catch (e) {

      console.error(e);
      return null;

    }

  }

};

export default profileService;