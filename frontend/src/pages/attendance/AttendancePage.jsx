import React, { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { useAttendance } from "../../hooks/useAttendance";
import { calculateStats } from "../../utils/attendanceUtils";
import AttendanceStats from "../../components/attendance/AttendanceStats";
import AttendanceCard from "../../components/attendance/AttendanceCard";
import AttendanceForm from "../../components/attendance/AttendanceForm";
import attendanceService from "../../services/attendanceService";
import "./AttendancePage.css";

export function AttendancePage() {
  const { navigateToDetails } = useNavigation();

  const {
    subjects,
    logs,
    overallStats,
    addSubject,
    updateSubject,
    addLog,
  } = useAttendance();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  // Quick Mark Attendance
  const handleQuickMark = async (subjectId, status) => {
    const today = new Date().toISOString().split("T")[0];

    await addLog({
      attendanceDate: today,
      status,
      notes: "Quick logged from Dashboard",
      subject: {
        id: subjectId,
      },
    });
  };

  const handleOpenSubjectForm = () => {
    setEditingData(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingData) {
      await updateSubject(formData);
    } else {
      await addSubject(formData);
    }

    setIsFormOpen(false);
  };

  // Delete All Subjects
  const handleDeleteAllSubjects = async () => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete all subjects?\n\nThis will also delete all attendance records."
    );

    if (!confirmDelete) return;

    try {
      await attendanceService.deleteAllSubjects();

      alert("All subjects deleted successfully.");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete all subjects.");
    }
  };

  return (
      <div className="attendance-page">

        {/* Header */}

        <div className="attendance-header">
          <div className="header-text-container">
            <h1 className="page-title">Attendance Tracker</h1>

            <p className="page-subtitle">
              Monitor subject metrics, log classes, and plan your leaves
              strategically.
            </p>
          </div>

          <div
              className="header-actions"
              style={{ display: "flex", gap: "12px" }}
          >
            <button
                onClick={handleOpenSubjectForm}
                className="btn-primary-add"
            >
              <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="plus-icon"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>

              Add Subject
            </button>

            <button
                onClick={handleDeleteAllSubjects}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
            >
              Delete All Subjects
            </button>
          </div>
        </div>

        {/* Overall Stats */}

        <AttendanceStats
            stats={overallStats}
            target={75}
        />

        {/* Subject Cards */}

        <div className="recent-logs-section">
          <h2 className="subjects-grid-title">
            Subjects Breakdown
          </h2>

          {subjects.length === 0 ? (
              <div
                  className="table-empty-state glass-card"
                  style={{ padding: "40px 20px" }}
              >
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14v7" />
                  <path d="M3 19v-5c0-1.66 4-3 9-3s9 1.34 9 3v5" />
                </svg>

                <p>
                  No subjects added yet. Click "Add Subject" to begin tracking.
                </p>
              </div>
          ) : (
              <div className="subjects-cards-grid">
                {subjects.map((subject) => {
                  const subLogs = logs.filter(
                      (log) => log.subject?.id === subject.id
                  );

                  const stats = calculateStats(subLogs);

                  return (
                      <AttendanceCard
                          key={subject.id}
                          subject={subject}
                          stats={stats}
                          onMarkAttendance={handleQuickMark}
                          onViewDetails={navigateToDetails}
                      />
                  );
                })}
              </div>
          )}
        </div>

        {/* Modal */}

        <AttendanceForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            mode="subject"
            subjects={subjects}
            initialData={editingData}
            onSubmit={handleFormSubmit}
        />
      </div>
  );
}

export default AttendancePage;