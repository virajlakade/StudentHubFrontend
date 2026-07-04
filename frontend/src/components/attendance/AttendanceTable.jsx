import React, { useState } from "react";
import { formatDate } from "../../utils/attendanceUtils";
import "./AttendanceTable.css";

export function AttendanceTable({
                                  logs,
                                  subjects,
                                  onEditLog,
                                  onDeleteLog
                                }) {

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const getSubjectInfo = (subjectId) => {
    const subject = subjects.find(
        (s) => Number(s.id) === Number(subjectId)
    );

    if (!subject) {
      return {
        name: "Deleted Subject",
        code: ""
      };
    }

    return {
      name: subject.name,
      code: subject.code
    };
  };

  const filteredLogs = logs.filter((log) => {

    const subInfo = getSubjectInfo(log.subject?.id);

    const matchesSearch =
        searchTerm === "" ||
        subInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subInfo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.notes || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

    const matchesSubject =
        selectedSubjectId === "all" ||
        Number(log.subject?.id) === Number(selectedSubjectId);

    const matchesStatus =
        selectedStatus === "all" ||
        log.status === selectedStatus;

    return (
        matchesSearch &&
        matchesSubject &&
        matchesStatus
    );
  });

  return (
      <div className="attendance-table-container">

        {/* Filters */}

        <div className="table-filters-bar">

          <div className="search-input-wrapper">

            <svg
                className="search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>

            <input
                type="text"
                className="filter-search-input"
                placeholder="Search logs by subject, code, or notes..."
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
            />

          </div>

          <div className="dropdowns-group">

            <select
                className="filter-select"
                value={selectedSubjectId}
                onChange={(e)=>setSelectedSubjectId(e.target.value)}
            >

              <option value="all">
                All Subjects
              </option>

              {subjects.map((subject)=>(
                  <option
                      key={subject.id}
                      value={subject.id}
                  >
                    {subject.code}
                  </option>
              ))}

            </select>

            <select
                className="filter-select"
                value={selectedStatus}
                onChange={(e)=>setSelectedStatus(e.target.value)}
            >

              <option value="all">
                All Statuses
              </option>

              <option value="PRESENT">
                Present
              </option>

              <option value="ABSENT">
                Absent
              </option>

              <option value="LATE">
                Late
              </option>

            </select>

          </div>

        </div>

        {/* Table */}

        <div className="table-responsive-wrapper">

          {filteredLogs.length === 0 ? (

              <div className="table-empty-state">

                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                >
                  <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                  />

                  <line
                      x1="9"
                      y1="9"
                      x2="15"
                      y2="9"
                  />

                  <line
                      x1="9"
                      y1="13"
                      x2="15"
                      y2="13"
                  />

                  <line
                      x1="9"
                      y1="17"
                      x2="13"
                      y2="17"
                  />

                </svg>

                <p>
                  No class logs match your filters.
                </p>

              </div>

          ) : (

              <table className="logs-table">

                <thead>

                <tr>

                  <th>Date</th>

                  <th>Subject</th>

                  <th>Status</th>

                  <th>Notes</th>

                  <th style={{textAlign:"right"}}>
                    Actions
                  </th>

                </tr>

                </thead>

                <tbody>

                {filteredLogs.map((log)=>{

                  const subInfo = getSubjectInfo(
                      log.subject?.id
                  );

                  return (

                      <tr
                          key={log.id}
                          className="log-row"
                      >

                        <td>
                          {formatDate(log.attendanceDate)}
                        </td>

                        <td>

                          <div className="subject-info-cell">

                      <span className="cell-subject-code">
                        {subInfo.code}
                      </span>

                            <span className="cell-subject-name">
                        {subInfo.name}
                      </span>

                          </div>

                        </td>

                        <td>

                    <span
                        className={`status-pill pill-${log.status.toLowerCase()}`}
                    >
                      {log.status}
                    </span>

                        </td>

                        <td>

                          {log.notes
                              ? log.notes
                              : "—"}

                        </td>

                        <td
                            style={{
                              textAlign:"right"
                            }}
                        >

                          <div className="action-buttons-wrapper">

                            <button
                                className="table-action-btn edit-btn"
                                onClick={()=>onEditLog(log)}
                            >

                              Edit

                            </button>

                            <button
                                className="table-action-btn delete-btn"
                                onClick={()=>onDeleteLog(log.id)}
                            >

                              Delete

                            </button>

                          </div>

                        </td>

                      </tr>

                  );

                })}

                </tbody>

              </table>

          )}

        </div>

      </div>
  );

}

export default AttendanceTable;