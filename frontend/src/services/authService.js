import axios from "axios";

const BASE_URL = "http://localhost:8090";

export const TOKEN_KEY = "studenthub_token";
export const USER_KEY = "studenthub_user";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================

api.interceptors.response.use(
    (response) => response,

    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        if (!window.location.pathname.includes("login")) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
);

// ================= PRIVATE METHODS =================

const saveSession = (data) => {
  localStorage.setItem(TOKEN_KEY, data.token);

  localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      })
  );
};

// ================= AUTH SERVICE =================

const authService = {
  // ---------------- LOGIN ----------------

  async login(email, password) {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    saveSession(response.data);

    return response.data;
  },

  // ---------------- REGISTER ----------------

  async register(user) {
    const response = await api.post("/api/auth/register", {
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      phone: user.phone || "",
      branch: user.branch || "",
      yearOfStudy: user.yearOfStudy || 1,
      rollNumber: user.rollNumber || "",
      degreeProgram: user.degreeProgram || "",
    });

    saveSession(response.data);

    return response.data;
  },

  // ---------------- OAUTH ----------------

  async saveOAuthLogin(token) {
    localStorage.setItem(TOKEN_KEY, token);

    return await this.loadCurrentUser();
  },

  // ---------------- CURRENT USER ----------------

  async loadCurrentUser() {
    try {
      const response = await api.get("/api/users/me");

      localStorage.setItem(
          USER_KEY,
          JSON.stringify(response.data)
      );

      return response.data;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  getCurrentUser() {
    const user = localStorage.getItem(USER_KEY);

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  // ---------------- USERS ----------------

  async getUsers() {
    const response = await api.get("/api/users");

    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/api/users/${id}`);

    return response.data;
  },

  // ---------------- UPDATE PROFILE ----------------

  async updateSessionProfile(profile) {
    const currentUser = this.getCurrentUser();

    if (!currentUser) {
      throw new Error("User not logged in.");
    }

    const response = await api.put(
        `/api/users/${currentUser.id}`,
        profile
    );

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(response.data)
    );

    return response.data;
  },

  // ---------------- TOKEN ----------------

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  // ---------------- LOGOUT ----------------

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    if (!window.location.pathname.includes("login")) {
      window.location.href = "/login";
    }
  },
};

export default authService;