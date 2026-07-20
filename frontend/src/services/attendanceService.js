import { api } from "./authService";
import { profileService } from "./profileService";
import authService from "./authService";

const API = "/api";

export const attendanceService = {

  // ================= SUBJECT =================

  getSubjects: async () => {
    const response = await api.get(`${API}/subjects`);
    return response.data;
  },

  addSubject: async (subject) => {

    const response = await api.post(
        `${API}/subjects`,
        subject
    );

    profileService.logActivity(
        `Added new subject "${response.data.name}".`,
        "attendance"
    );

    return response.data;
  },

  updateSubject: async (subject) => {

    const response = await api.put(
        `${API}/subjects/${subject.id}`,
        subject
    );

    profileService.logActivity(
        `Updated subject "${response.data.name}".`,
        "attendance"
    );

    return response.data;
  },

  deleteSubject: async (id) => {

    await api.delete(`${API}/subjects/${id}`);

    profileService.logActivity(
        "Deleted subject.",
        "attendance"
    );

    return true;
  },

  // ================= ATTENDANCE =================

  getLogs: async () => {

    const response = await api.get(`${API}/attendance`);

    return response.data;
  },

  getLogsBySubject: async (subjectId) => {

    const response = await api.get(
        `${API}/attendance/subject/${subjectId}`
    );

    return response.data;
  },

  addLog: async (log) => {

    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      throw new Error("User not logged in.");
    }

    const payload = {
      attendanceDate: log.attendanceDate,
      status: log.status.toUpperCase(),
      notes: log.notes,
      subject: {
        id: Number(log.subject.id)
      },
      user: {
        id: Number(currentUser.id)
      }
    };

    console.log("Attendance Payload:", payload);

    const response = await api.post(
        `${API}/attendance`,
        payload
    );

    profileService.logActivity(
        "Marked attendance.",
        "attendance"
    );

    return response.data;
  },

  updateLog: async (log) => {

    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      throw new Error("User not logged in.");
    }

    const payload = {
      id: log.id,
      attendanceDate: log.attendanceDate,
      status: log.status.toUpperCase(),
      notes: log.notes,
      subject: {
        id: Number(log.subject.id)
      },
      user: {
        id: Number(currentUser.id)
      }
    };

    const response = await api.put(
        `${API}/attendance/${log.id}`,
        payload
    );

    profileService.logActivity(
        "Updated attendance.",
        "attendance"
    );

    return response.data;
  },

  deleteLog: async (id) => {

    await api.delete(`${API}/attendance/${id}`);

    profileService.logActivity(
        "Deleted attendance.",
        "attendance"
    );

    return true;
  }

};

export default attendanceService;