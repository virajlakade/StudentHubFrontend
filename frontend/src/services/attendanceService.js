import { api } from "./authService";
import { profileService } from "./profileService";
import authService from "./authService";

const API = "/api";

const getCurrentUserId = () => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    throw new Error("User not logged in.");
  }

  return currentUser.id;
};

export const attendanceService = {

  // ================= SUBJECT =================

  getSubjects: async () => {
    const userId = getCurrentUserId();

    const response = await api.get(
        `${API}/subjects/user/${userId}`
    );

    return response.data;
  },

  addSubject: async (subject) => {
    const userId = getCurrentUserId();

    const response = await api.post(
        `${API}/subjects/user/${userId}`,
        subject
    );

    profileService.logActivity(
        `Added new subject "${response.data.name}".`,
        "attendance"
    );

    return response.data;
  },

  updateSubject: async (subject) => {
    const userId = getCurrentUserId();

    const response = await api.put(
        `${API}/subjects/user/${userId}/${subject.id}`,
        subject
    );

    profileService.logActivity(
        `Updated subject "${response.data.name}".`,
        "attendance"
    );

    return response.data;
  },

  deleteSubject: async (id) => {
    const userId = getCurrentUserId();

    await api.delete(
        `${API}/subjects/user/${userId}/${id}`
    );

    profileService.logActivity(
        "Deleted subject.",
        "attendance"
    );

    return true;
  },

  // ================= ATTENDANCE =================

  getLogs: async () => {
    const userId = getCurrentUserId();

    const response = await api.get(
        `${API}/attendance/user/${userId}`
    );

    return response.data;
  },

  getLogsBySubject: async (subjectId) => {
    const userId = getCurrentUserId();

    const response = await api.get(
        `${API}/attendance/user/${userId}/subject/${subjectId}`
    );

    return response.data;
  },

  addLog: async (log) => {
    const userId = getCurrentUserId();

    const payload = {
      attendanceDate: log.attendanceDate,
      status: log.status.toUpperCase(),
      notes: log.notes,
      subject: {
        id: Number(log.subject.id)
      }
    };

    console.log("Attendance Payload:", payload);

    const response = await api.post(
        `${API}/attendance/user/${userId}`,
        payload
    );

    profileService.logActivity(
        "Marked attendance.",
        "attendance"
    );

    return response.data;
  },

  updateLog: async (log) => {
    const userId = getCurrentUserId();

    const payload = {
      attendanceDate: log.attendanceDate,
      status: log.status.toUpperCase(),
      notes: log.notes,
      subject: {
        id: Number(log.subject.id)
      }
    };

    const response = await api.put(
        `${API}/attendance/user/${userId}/${log.id}`,
        payload
    );

    profileService.logActivity(
        "Updated attendance.",
        "attendance"
    );

    return response.data;
  },

  deleteLog: async (id) => {
    const userId = getCurrentUserId();

    await api.delete(
        `${API}/attendance/user/${userId}/${id}`
    );

    profileService.logActivity(
        "Deleted attendance.",
        "attendance"
    );

    return true;
  }

};

export default attendanceService;