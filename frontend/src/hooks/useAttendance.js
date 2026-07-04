import { useState, useEffect, useCallback } from "react";
import { attendanceService } from "../services/attendanceService";
import { calculateOverallStats } from "../utils/attendanceUtils";

export function useAttendance() {

  const [subjects, setSubjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [overallStats, setOverallStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {

    setLoading(true);

    try {

      const subList = await attendanceService.getSubjects();
      const logList = await attendanceService.getLogs();

      setSubjects(subList);
      setLogs(logList);

      const stats = calculateOverallStats(subList, logList);
      setOverallStats(stats);

    } catch (error) {
      console.error("Error loading attendance data:", error);
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addSubject = useCallback(async (subject) => {
    const newSub = await attendanceService.addSubject(subject);
    await refreshData();
    return newSub;
  }, [refreshData]);

  const updateSubject = useCallback(async (subject) => {
    const updated = await attendanceService.updateSubject(subject);
    await refreshData();
    return updated;
  }, [refreshData]);

  const deleteSubject = useCallback(async (subjectId) => {
    const result = await attendanceService.deleteSubject(subjectId);
    await refreshData();
    return result;
  }, [refreshData]);

  const addLog = useCallback(async (log) => {
    const newLog = await attendanceService.addLog(log);
    await refreshData();
    return newLog;
  }, [refreshData]);

  const updateLog = useCallback(async (log) => {
    const updated = await attendanceService.updateLog(log);
    await refreshData();
    return updated;
  }, [refreshData]);

  const deleteLog = useCallback(async (logId) => {
    const result = await attendanceService.deleteLog(logId);
    await refreshData();
    return result;
  }, [refreshData]);

  return {
    subjects,
    logs,
    overallStats,
    loading,
    refreshData,
    addSubject,
    updateSubject,
    deleteSubject,
    addLog,
    updateLog,
    deleteLog
  };
}

export default useAttendance;