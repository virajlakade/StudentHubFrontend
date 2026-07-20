import { api } from "./authService";
import { profileService } from "./profileService";

const API = "/api/lostfound";

export const lostFoundService = {

  // ================= GET ALL =================

  getItems: async () => {
    const response = await api.get(API);
    return response.data;
  },

  // ================= GET BY ID =================

  getItemById: async (id) => {
    const response = await api.get(`${API}/${id}`);
    return response.data;
  },

  // ================= ADD =================

  addItem: async (item) => {

    const profile = await profileService.getProfile();

    if (!profile) {
      throw new Error("User not logged in.");
    }

    const formData = new FormData();

    formData.append("title", item.title);
    formData.append("status", item.status);
    formData.append("category", item.category);
    formData.append("location", item.location);
    formData.append("description", item.description);

    formData.append("contactName", profile.fullName);
    formData.append("contactEmail", profile.email);
    formData.append("userId", profile.id);

    if (item.image) {
      formData.append("image", item.image);
    }

    const response = await api.post(API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    profileService.logActivity(
        `Reported "${response.data.title}".`,
        "lost-found"
    );

    return response.data;
  },

  // ================= CLAIM =================

  claimItem: async (id) => {

    const profile = await profileService.getProfile();

    const response = await api.post(
        `${API}/claim/${id}?finderUserId=${profile.id}`
    );

    return response.data;
  },

  // ================= UPDATE =================

  updateItem: async (item) => {

    const response = await api.put(`${API}/${item.id}`, item);

    profileService.logActivity(
        `Updated "${response.data.title}".`,
        "lost-found"
    );

    return response.data;
  },

  // ================= DELETE =================

  deleteItem: async (id) => {

    await api.delete(`${API}/${id}`);

    profileService.logActivity(
        "Deleted Lost & Found item.",
        "lost-found"
    );

    return true;
  }

};

export default lostFoundService;