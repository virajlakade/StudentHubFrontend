import axios from "axios";
import { profileService } from "./profileService";

const API = "http://localhost:8090/api/placements";

export const placementService = {

  // ================= GET ALL =================

  getExperiences: async () => {
    const response = await axios.get(API);
    return response.data;
  },

  // ================= GET BY ID =================

  getExperienceById: async (id) => {
    const response = await axios.get(`${API}/${id}`);
    return response.data;
  },

  // ================= ADD =================
  addExperience: async (experience) => {

    const profile = await profileService.getProfile();

    if (!profile) {
      throw new Error("Profile not found.");
    }

    const payload = {
      ...experience,

      user: {
        id: profile.id
      },

      authorName: profile.fullName,      authorEmail: profile.email
    };

    console.log("PROFILE:", profile);
    console.log("PAYLOAD:", payload);

    const response = await axios.post(API, payload);

    profileService.logActivity(
        `Shared interview experience at "${response.data.companyName}".`,
        "placement"
    );

    return response.data;
  },
  // ================= UPDATE =================

  updateExperience: async (experience) => {

    const response = await axios.put(
        `${API}/${experience.id}`,
        experience
    );

    profileService.logActivity(
        `Updated interview experience at "${response.data.companyName}".`,
        "placement"
    );

    return response.data;
  },

  // ================= DELETE =================

  deleteExperience: async (id) => {

    await axios.delete(`${API}/${id}`);

    profileService.logActivity(
        "Deleted an interview experience.",
        "placement"
    );

    return true;
  },

  // ================= LIKE =================

  likeExperience: async (id) => {

    const response = await axios.put(`${API}/${id}/like`);

    return response.data;
  }

};

export default placementService;