import axios from "axios";
import { profileService } from "./profileService";

const POST_API = "http://localhost:8090/api/roommate/posts";
const REQUEST_API = "http://localhost:8090/api/roommate/requests";

export const roommateService = {

  // ================= POSTS =================

  getPosts: async () => {
    const response = await axios.get(POST_API);
    return response.data;
  },

  getPostById: async (id) => {
    const response = await axios.get(`${POST_API}/${id}`);
    return response.data;
  },

  createPost: async (postData) => {

    const profile = profileService.getProfile();

    const payload = {
      title: postData.title,
      location: postData.location,
      rent: Number(postData.rent),
      description: postData.description,
      tags: postData.tags || [],
      gender: postData.gender,
      status: "OPEN",
      userId: profile.id || 1,
      contactName: profile.name,
      contactEmail: profile.email,
      contactPhone: profile.phone,
      avatar: profile.avatar,
      degree: profile.degree,
      year: profile.year
    };

    console.log(payload);

    const response = await axios.post(POST_API, payload);
    profileService.logActivity(
        `Published roommate requirement: "${response.data.title}".`,
        "roommate"
    );

    return response.data;
  },

  deletePost: async (id) => {

    await axios.delete(`${POST_API}/${id}`);

    profileService.logActivity(
        "Deleted roommate requirement.",
        "roommate"
    );

    return true;
  },

  // ================= REQUESTS =================

  getRequests: async () => {
    const response = await axios.get(REQUEST_API);
    return response.data;
  },

  sendConnectionRequest: async (postId, message) => {

    const profile = profileService.getProfile();

    const payload = {
      postId,
      senderName: profile.name,
      senderAvatar: profile.avatar,
      senderEmail: profile.email,
      senderPhone: profile.phone,
      message
    };

    const response = await axios.post(REQUEST_API, payload);

    profileService.logActivity(
        `Sent roommate connection request.`,
        "roommate"
    );

    return response.data;
  },

  updateRequestStatus: async (requestId, status) => {

    const response = await axios.put(
        `${REQUEST_API}/${requestId}`,
        { status }
    );

    profileService.logActivity(
        `${status} roommate connection request.`,
        "roommate"
    );

    return response.data;
  }

};

export default roommateService;