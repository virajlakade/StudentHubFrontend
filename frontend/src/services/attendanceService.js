import axios from "axios";
import { profileService } from "./profileService";

const API = "http://localhost:8090/api";

export const attendanceService = {

  // ================= SUBJECT =================

  getSubjects: async () => {
    const response = await axios.get(`${API}/subjects`);
    return response.data;
  },

  addSubject: async (subject) => {
    const response = await axios.post(`${API}/subjects`, subject);

    profileService.logActivity(
        `Added new subject "${response.data.name}".`,
        "attendance"
    );

    return response.data;
  },

  updateSubject: async (subject) => {
    const response = await axios.put(
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
    await axios.delete(`${API}/subjects/${id}`);

    profileService.logActivity(
        "Deleted subject.",
        "attendance"
    );

    return true;
  },

  // ================= ATTENDANCE =================

  getLogs: async () => {
    const response = await axios.get(`${API}/attendance`);
    return response.data;
  },

  getLogsBySubject: async (subjectId) => {
    const response = await axios.get(
        `${API}/attendance/subject/${subjectId}`
    );

    return response.data;
  },

  addLog: async (log) => {

    const payload = {
      attendanceDate: log.attendanceDate,
      status: log.status.toUpperCase(),
      notes: log.notes,
      subject: {
        id: Number(log.subject.id)
      }
    };

    console.log("Attendance Payload :", payload);

    const response = await axios.post(
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

    const payload = {
      id: log.id,
      attendanceDate: log.attendanceDate,
      status: log.status.toUpperCase(),
      notes: log.notes,
      subject: {
        id: Number(log.subject.id)
      }
    };

    const response = await axios.put(
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

    await axios.delete(`${API}/attendance/${id}`);

    profileService.logActivity(
        "Deleted attendance.",
        "attendance"
    );

    return true;
  }

};

export default attendanceService;