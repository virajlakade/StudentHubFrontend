import { api } from "./authService";
import { profileService } from "./profileService";

const POST_API = "/api/roommate/posts";
const REQUEST_API = "/api/roommate/requests";

export const roommateService = {

  // ================= POSTS =================

  getPosts: async () => {
    const response = await api.get(POST_API);
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`${POST_API}/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const profile = await profileService.getProfile();

    if (!profile) {
      throw new Error("User profile not found.");
    }

    if (!profile.id) {
      throw new Error("User ID not found.");
    }

    const payload = {
      title: postData.title?.trim(),
      description: postData.description?.trim() || "",
      location: postData.location?.trim(),
      rent: Number(postData.rent),
      gender: postData.gender,
      occupancy: postData.occupancy,
      status: "OPEN",
      tags: Array.isArray(postData.tags) ? postData.tags : [],

      user: {
        id: profile.id,
      },

      contactName: profile.fullName,
      contactEmail: profile.email,
      contactPhone: profile.phone,
      avatar: profile.profileImage,
      branch: profile.branch,
      degreeProgram: profile.degreeProgram,
      yearOfStudy: profile.yearOfStudy,
    };

    console.log("Roommate Payload");
    console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await api.post(POST_API, payload);

      await profileService.logActivity(
          `Published roommate requirement: "${response.data.title}".`,
          "roommate"
      );

      return response.data;
    } catch (error) {
      console.error("Create Post Error:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);
      }

      throw error;
    }
  },

  deletePost: async (id) => {
    await api.delete(`${POST_API}/${id}`);

    await profileService.logActivity(
        "Deleted roommate requirement.",
        "roommate"
    );

    return true;
  },

  // ================= REQUESTS =================

  getRequests: async () => {
    const response = await api.get(REQUEST_API);
    return response.data;
  },

  sendConnectionRequest: async (post, message) => {
    const profile = await profileService.getProfile();

    if (!profile) {
      throw new Error("User profile not found.");
    }

    if (!post?.user?.id) {
      throw new Error("Post owner not found.");
    }

    if (profile.id === post.user.id) {
      throw new Error("You cannot send a request to your own listing.");
    }

    const payload = {
      post: {
        id: post.id,
      },
      sender: {
        id: profile.id,
      },
      receiver: {
        id: post.user.id,
      },
      status: "PENDING",
      message,
    };

    console.log("Request Payload");
    console.log(JSON.stringify(payload, null, 2));

    const response = await api.post(REQUEST_API, payload);

    await profileService.logActivity(
        "Sent roommate connection request.",
        "roommate"
    );

    return response.data;
  },

  updateRequestStatus: async (requestId, status) => {
    const response = await api.put(
        `${REQUEST_API}/${requestId}/${status}`
    );

    await profileService.logActivity(
        `${status} roommate connection request.`,
        "roommate"
    );

    return response.data;
  },

};

export default roommateService;