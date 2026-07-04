import React, { useState, useEffect } from "react";
import "./AttendanceForm.css";

export function AttendanceForm({
                                 isOpen,
                                 onClose,
                                 mode,
                                 subjects,
                                 initialData,
                                 onSubmit,
                               }) {
  // Subject Fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [instructor, setInstructor] = useState("");
  const [room, setRoom] = useState("");
  const [targetPercentage, setTargetPercentage] = useState(75);

  // Attendance Fields
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("PRESENT");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setError("");

    if (mode === "subject") {
      if (initialData) {
        setName(initialData.name || "");
        setCode(initialData.code || "");
        setInstructor(initialData.instructor || "");
        setRoom(initialData.room || "");
        setTargetPercentage(initialData.targetPercentage || 75);
      } else {
        setName("");
        setCode("");
        setInstructor("");
        setRoom("");
        setTargetPercentage(75);
      }
    } else {
      if (initialData) {
        setSubjectId(initialData.subject?.id || initialData.subjectId || "");
        setDate(
            initialData.attendanceDate ||
            initialData.date ||
            new Date().toISOString().split("T")[0]
        );
        setStatus(initialData.status || "PRESENT");
        setNotes(initialData.notes || "");
      } else {
        setSubjectId(subjects.length ? subjects[0].id : "");
        setDate(new Date().toISOString().split("T")[0]);
        setStatus("PRESENT");
        setNotes("");
      }
    }
  }, [isOpen, mode, initialData, subjects]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "subject") {
      if (
          !name.trim() ||
          !code.trim() ||
          !instructor.trim()
      ) {
        setError("Please fill all required fields.");
        return;
      }

      onSubmit({
        ...(initialData || {}),
        name: name.trim(),
        code: code.trim(),
        instructor: instructor.trim(),
        room: room.trim(),
        targetPercentage: Number(targetPercentage),
      });
    } else {
      if (!subjectId) {
        setError("Please select a subject.");
        return;
      }

      onSubmit({
        ...(initialData || {}),
        attendanceDate: date,
        status,
        notes: notes.trim(),
        subject: {
          id: Number(subjectId),
        },
      });
    }

    onClose();
  };

  return (
      <div
          className="attendance-modal-overlay"
          onClick={onClose}
      >
        <div
            className="attendance-modal-card glass-card"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3 className="modal-title">
              {initialData ? "Edit" : "Add"}{" "}
              {mode === "subject"
                  ? "Subject"
                  : "Attendance"}
            </h3>

            <button
                className="modal-close-btn"
                onClick={onClose}
            >
              ✕
            </button>
          </div>

          <form
              onSubmit={handleSubmit}
              className="modal-form-body"
          >
            {error && (
                <div className="form-error-alert">
                  {error}
                </div>
            )}

            {mode === "subject" ? (
                <>
                  <div className="form-field-group">
                    <label>Subject Name *</label>
                    <input
                        className="form-text-input"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Subject Code *</label>
                    <input
                        className="form-text-input"
                        value={code}
                        onChange={(e) =>
                            setCode(e.target.value)
                        }
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Instructor *</label>
                    <input
                        className="form-text-input"
                        value={instructor}
                        onChange={(e) =>
                            setInstructor(e.target.value)
                        }
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Room</label>
                    <input
                        className="form-text-input"
                        value={room}
                        onChange={(e) =>
                            setRoom(e.target.value)
                        }
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Target %</label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        className="form-text-input"
                        value={targetPercentage}
                        onChange={(e) =>
                            setTargetPercentage(e.target.value)
                        }
                    />
                  </div>
                </>
            ) : (
                <>
                  <div className="form-field-group">
                    <label>Subject</label>

                    <select
                        className="form-select-input"
                        value={subjectId}
                        onChange={(e) =>
                            setSubjectId(e.target.value)
                        }
                    >
                      {subjects.map((s) => (
                          <option
                              key={s.id}
                              value={s.id}
                          >
                            {s.code} - {s.name}
                          </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label>Date</label>

                    <input
                        type="date"
                        className="form-text-input"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Status</label>

                    <select
                        className="form-select-input"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                      <option value="PRESENT">
                        PRESENT
                      </option>

                      <option value="ABSENT">
                        ABSENT
                      </option>

                      <option value="LATE">
                        LATE
                      </option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label>Notes</label>

                    <textarea
                        className="form-textarea-input"
                        value={notes}
                        onChange={(e) =>
                            setNotes(e.target.value)
                        }
                    />
                  </div>
                </>
            )}

            <div className="modal-actions-footer">
              <button
                  type="button"
                  onClick={onClose}
                  className="modal-btn-secondary"
              >
                Cancel
              </button>

              <button
                  type="submit"
                  className="modal-btn-primary"
              >
                {initialData
                    ? "Update"
                    : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}

export default AttendanceForm;