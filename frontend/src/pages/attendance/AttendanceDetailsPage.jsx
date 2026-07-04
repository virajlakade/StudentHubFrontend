import React, { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { useAttendance } from "../../hooks/useAttendance";
import { calculateStats } from "../../utils/attendanceUtils";
import SubjectAttendance from "../../components/attendance/SubjectAttendance";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceForm from "../../components/attendance/AttendanceForm";
import "./AttendanceDetailsPage.css";

export function AttendanceDetailsPage() {

  const { selectedItemId, navigateToList } = useNavigation();

  const {
    subjects,
    logs,
    updateSubject,
    deleteSubject,
    addLog,
    updateLog,
    deleteLog
  } = useAttendance();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("subject");
  const [editingData, setEditingData] = useState(null);

  const subject = subjects.find(
      (s) => Number(s.id) === Number(selectedItemId)
  );

  if (!subject) {
    return (
        <div
            className="table-empty-state glass-card"
            style={{ padding: "64px 32px" }}
        >
          <h2>Subject Not Found</h2>

          <button
              onClick={navigateToList}
              className="btn-primary-add"
          >
            Back
          </button>
        </div>
    );
  }

  const subjectLogs = logs.filter(
      (log) => Number(log.subject?.id) === Number(subject.id)
  );

  const stats = calculateStats(subjectLogs);

  const handleEditSubject = () => {
    setFormMode("subject");
    setEditingData(subject);
    setIsFormOpen(true);
  };

  const handleDeleteSubject = () => {
    if (
        window.confirm(
            `Delete ${subject.name}?`
        )
    ) {
      deleteSubject(subject.id);
      navigateToList();
    }
  };

  const handleLogClassClick = () => {

    setFormMode("log");

    setEditingData({
      attendanceDate: new Date().toISOString().split("T")[0],
      status: "PRESENT",
      notes: "",
      subject: {
        id: subject.id
      }
    });

    setIsFormOpen(true);
  };

  const handleEditLog = (log) => {

    setFormMode("log");
    setEditingData(log);
    setIsFormOpen(true);

  };

  const handleFormSubmit = async (formData) => {

    if (formMode === "subject") {

      await updateSubject(formData);

    } else {

      if (editingData?.id) {

        await updateLog(formData);

      } else {

        await addLog(formData);

      }

    }

    setIsFormOpen(false);

  };

  return (
      <div className="attendance-page">

        <div className="attendance-header">

          <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
          >

            <button
                onClick={navigateToList}
                className="btn-back-nav"
            >
              ←
            </button>

            <div className="header-text-container">

              <div className="detail-page-header">

                <h1 className="page-title">
                  {subject.name}
                </h1>

                <span
                    className={`stats-status-badge badge-${
                        stats.percentage >= subject.targetPercentage
                            ? "safe"
                            : "danger"
                    }`}
                >
                {stats.percentage}%
              </span>

              </div>

              <div className="subject-details-meta-bar">

              <span>
                Code : {subject.code}
              </span>

                <span>
                Room : {subject.room}
              </span>

                <span>
                Instructor : {subject.instructor}
              </span>

              </div>

            </div>

          </div>

          <div className="header-actions">

            <button
                onClick={handleEditSubject}
                className="btn-secondary-log"
            >
              Edit Subject
            </button>

            <button
                onClick={handleDeleteSubject}
                className="btn-secondary-log"
            >
              Delete Subject
            </button>

            <button
                onClick={handleLogClassClick}
                className="btn-primary-add"
            >
              Log Class
            </button>

          </div>

        </div>

        <SubjectAttendance
            subject={subject}
            stats={stats}
        />

        <div className="recent-logs-section">

          <h2 className="subjects-grid-title">
            Class Log History
          </h2>

          <AttendanceTable
              logs={subjectLogs}
              subjects={subjects}
              onEditLog={handleEditLog}
              onDeleteLog={deleteLog}
          />

        </div>

        <AttendanceForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            mode={formMode}
            subjects={subjects}
            initialData={editingData}
            onSubmit={handleFormSubmit}
        />

      </div>
  );
}

export default AttendanceDetailsPage;