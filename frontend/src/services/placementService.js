import { api } from "./authService";
import { profileService } from "./profileService";

const API = "/api/placements";

export const placementService = {

  // ================= GET ALL =================

  getExperiences: async () => {
    const response = await api.get(API);
    return response.data;
  },

  // ================= GET BY ID =================

  getExperienceById: async (id) => {
    const response = await api.get(`${API}/${id}`);
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
      authorName: profile.fullName,
      authorEmail: profile.email
    };

    console.log("PROFILE:", profile);
    console.log("PAYLOAD:", payload);

    const response = await api.post(API, payload);

    profileService.logActivity(
        `Shared interview experience at "${response.data.companyName}".`,
        "placement"
    );

    return response.data;
  },

  // ================= UPDATE =================

  updateExperience: async (experience) => {

    const response = await api.put(
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

    await api.delete(`${API}/${id}`);

    profileService.logActivity(
        "Deleted an interview experience.",
        "placement"
    );

    return true;
  },

  // ================= LIKE =================

  likeExperience: async (id) => {

    const response = await api.put(`${API}/${id}/like`);

    return response.data;
  }

};

export default placementService;