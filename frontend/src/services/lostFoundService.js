import axios from "axios";
import { profileService } from "./profileService";

const API = "http://localhost:8090/api/lostfound";

export const lostFoundService = {

  // ---------------- GET ALL ----------------

  getItems: async () => {
    const response = await axios.get(API);
    return response.data;
  },

  // ---------------- GET BY ID ----------------

  getItemById: async (id) => {
    try {
      const response = await axios.get(`${API}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching item:", error);
      return null;
    }
  },

  // ---------------- ADD ----------------

  addItem: async (item) => {

    const response = await axios.post(API, item);

    profileService.logActivity(
        `Reported a ${response.data.status} item: "${response.data.title}".`,
        "lost-found"
    );

    return response.data;
  },

  // ---------------- UPDATE ----------------

  updateItem: async (item) => {

    const response = await axios.put(
        `${API}/${item.id}`,
        item
    );

    profileService.logActivity(
        `Updated "${response.data.title}".`,
        "lost-found"
    );

    return response.data;
  },

  // ---------------- DELETE ----------------

  deleteItem: async (id) => {

    await axios.delete(`${API}/${id}`);

    profileService.logActivity(
        "Deleted a Lost & Found item.",
        "lost-found"
    );

    return true;
  }

};

export default lostFoundService;