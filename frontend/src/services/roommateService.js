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

    const payload = {
      title: postData.title,
      location: postData.location,
      rent: Number(postData.rent),
      description: postData.description,
      tags: postData.tags || [],
      gender: postData.gender,
      occupancy: postData.occupancy,
      status: "OPEN",

      userId: profile.id,
      contactName: profile.fullName,
      contactEmail: profile.email,
      contactPhone: profile.phone,
      avatar: profile.avatar,
      degreeProgram: profile.degreeProgram,
      yearOfStudy: profile.yearOfStudy,
    };

    console.log("POST PAYLOAD:", payload);

    const response = await api.post(POST_API, payload);

    profileService.logActivity(
        `Published roommate requirement: "${response.data.title}".`,
        "roommate"
    );

    return response.data;
  },

  deletePost: async (id) => {

    await api.delete(`${POST_API}/${id}`);

    profileService.logActivity(
        "Deleted roommate requirement.",
        "roommate"
    );

    return true;
  },

  // ================= REQUESTS =================

  getRequests: async () => {

    const response = await api.get(REQUEST_API);

    console.log("REQUEST DATA:", response.data);

    return response.data;
  },

  sendConnectionRequest: async (post, message) => {

    const profile = await profileService.getProfile();

    if (!profile) {
      throw new Error("User profile not found.");
    }

    if (!post?.user?.id) {
      throw new Error("Post owner information is missing.");
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

    console.log("Request Payload:", payload);

    const response = await api.post(REQUEST_API, payload);

    profileService.logActivity(
        "Sent roommate connection request.",
        "roommate"
    );

    return response.data;
  },

  updateRequestStatus: async (requestId, status) => {

    console.log("Updating Request:", requestId, status);

    const response = await api.put(
        `${REQUEST_API}/${requestId}`,
        {
          status,
        }
    );

    profileService.logActivity(
        `${status} roommate connection request.`,
        "roommate"
    );

    return response.data;
  },

};

export default roommateService;