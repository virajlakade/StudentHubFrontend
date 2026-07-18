import axios from "axios";
import { profileService } from "./profileService";

const API = "http://localhost:8090/api/lostfound";

export const lostFoundService = {

  // ================= GET ALL =================

  getItems: async () => {
    const response = await axios.get(API);
    return response.data;
  },

  // ================= GET BY ID =================

  getItemById: async (id) => {
    try {
      const response = await axios.get(`${API}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching item:", error);
      return null;
    }
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

    const response = await axios.post(API, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    profileService.logActivity(
        `Reported "${response.data.title}".`,
        "lost-found"
    );

    return response.data;
  },

  // ================= UPDATE =================

  updateItem: async (item) => {

    const response = await axios.put(`${API}/${item.id}`, item);

    profileService.logActivity(
        `Updated "${response.data.title}".`,
        "lost-found"
    );

    return response.data;
  },

  // ================= DELETE =================

  deleteItem: async (id) => {

    await axios.delete(`${API}/${id}`);

    profileService.logActivity(
        "Deleted Lost & Found item.",
        "lost-found"
    );

    return true;
  }

};

export default lostFoundService;