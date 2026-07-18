import axios from "axios";

const API = "http://localhost:8090/api/users";
const SESSION_KEY = "studenthub_current_user";

export const authService = {

  async getUsers() {
    const response = await axios.get(API);
    return response.data;
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  },

  async login(email, password) {

    try {

      const response = await axios.get(`${API}/email/${email}`);
      const user = response.data;

      if (!user || user.password !== password) {
        throw new Error("Invalid email or password.");
      }

      localStorage.setItem(
          SESSION_KEY,
          JSON.stringify(user)
      );

      return user;

    } catch (error) {

      throw new Error("Invalid email or password.");

    }

  },

  async register(name, email, password) {

    try {

      const newUser = {
        fullName: name,
        email,
        password,
        phone: "",
        branch: "",
        yearOfStudy: 1,
        rollNumber: "",
        degreeProgram: "",
        skills: "",
        profileImage: "",
        bio: ""
      };

      const response = await axios.post(API, newUser);

      localStorage.setItem(
          SESSION_KEY,
          JSON.stringify(response.data)
      );

      return response.data;

    } catch (error) {

      if (
          error.response &&
          typeof error.response.data === "string"
      ) {
        throw new Error(error.response.data);
      }

      throw new Error("Registration failed.");

    }

  },

  async updateSessionProfile(profile) {

    const current = this.getCurrentUser();

    if (!current) {
      throw new Error("User not logged in.");
    }

    const response = await axios.put(
        `${API}/${current.id}`,
        {
          ...current,
          ...profile
        }
    );

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(response.data)
    );

    return response.data;

  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }

};

export default authService;