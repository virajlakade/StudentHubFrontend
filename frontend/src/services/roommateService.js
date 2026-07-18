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
      occupancy: postData.occupancy,
      status: "OPEN",
      userId: profile.id,
      contactName: profile.name,
      contactEmail: profile.email,
      contactPhone: profile.phone,
      avatar: profile.avatar,
      degreeProgram: profile.degree,
      yearOfStudy: profile.year,
    };

    console.log("POST PAYLOAD:", payload);

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

    console.log("REQUEST DATA");
    console.log(response.data);

    return response.data;
  },

  sendConnectionRequest: async (post, message) => {
    const profile = profileService.getProfile();

    if (!profile) {
      throw new Error("User profile not found.");
    }

    if (!post?.user?.id) {
      throw new Error("Post owner information is missing.");
    }

    if (profile.id === post.user.id) {
      alert("You cannot send a request to your own listing.");
      return;
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
      message: message,
    };

    console.log("Request Payload:");
    console.log(payload);

    const response = await axios.post(REQUEST_API, payload);

    profileService.logActivity(
        "Sent roommate connection request.",
        "roommate"
    );

    return response.data;
  },

  updateRequestStatus: async (requestId, status) => {
    console.log("Updating Request:", requestId, status);

    const response = await axios.put(
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