import { profileService } from "./profileService";

const BASE_URL = "http://localhost:8090/api";

export const confessionService = {

  // Get all confessions
  async getConfessions() {
    try {

      const response = await fetch(`${BASE_URL}/confessions`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Confessions Response:", data);
      console.log("Is Array?", Array.isArray(data));

      // If backend returns an array
      if (Array.isArray(data)) {
        return data;
      }

      // If backend returns a Spring Page object
      if (Array.isArray(data.content)) {
        return data.content;
      }

      // Otherwise return empty array
      return [];

    } catch (error) {

      console.error("Error fetching confessions:", error);
      return [];

    }
  },

  // Get confession by ID
  async getConfessionById(id) {
    try {

      const response = await fetch(
          `${BASE_URL}/confessions/${id}`
      );

      if (!response.ok) {
        throw new Error(
            `HTTP Error: ${response.status}`
        );
      }

      return await response.json();

    } catch (error) {

      console.error(
          "Error fetching confession:",
          error
      );

      return null;
    }
  },

  // Create confession
  async addConfession(text, category) {
    try {

      const response = await fetch(
          `${BASE_URL}/confessions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: category,
              message: text,
              category: category,
              likes: 0
            })
          }
      );

      if (!response.ok) {
        throw new Error(
            `HTTP Error: ${response.status}`
        );
      }

      const savedConfession =
          await response.json();

      profileService.trackMyConfession(
          savedConfession.id
      );

      profileService.logActivity(
          `Posted an anonymous confession under "${category}".`,
          "confession"
      );

      return savedConfession;

    } catch (error) {

      console.error(
          "Error creating confession:",
          error
      );

      return null;
    }
  },

  // Like confession
  async likeConfession(id) {
    try {

      const response = await fetch(
          `${BASE_URL}/confessions/${id}/like`,
          {
            method: "PUT"
          }
      );

      if (!response.ok) {
        throw new Error(
            `HTTP Error: ${response.status}`
        );
      }

      return await response.json();

    } catch (error) {

      console.error(
          "Error liking confession:",
          error
      );

      return null;
    }
  },

  // Load comments from database
  async getComments(confessionId) {
    try {

      const response = await fetch(
          `${BASE_URL}/comments/${confessionId}`
      );

      if (!response.ok) {
        throw new Error(
            `HTTP Error: ${response.status}`
        );
      }

      return await response.json();

    } catch (error) {

      console.error(
          "Error loading comments:",
          error
      );

      return [];
    }
  },

  // Save comment in database
  async addComment(
      confessionId,
      commentText
  ) {
    try {

      const response = await fetch(
          `${BASE_URL}/comments/${confessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              commentText: commentText
            })
          }
      );

      if (!response.ok) {
        throw new Error(
            `HTTP Error: ${response.status}`
        );
      }

      return await response.json();

    } catch (error) {

      console.error(
          "Error saving comment:",
          error
      );

      return null;
    }
  }

};

export default confessionService;