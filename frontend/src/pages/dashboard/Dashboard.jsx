import React, { useEffect, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { calculateOverallStats } from "../../utils/attendanceUtils";
import { roommateService } from "../../services/roommateService";
import { lostFoundService } from "../../services/lostFoundService";
import { confessionService } from "../../services/confessionService";
import { placementService } from "../../services/placementService";
import { attendanceService } from "../../services/attendanceService";

import RecentLostFound from "../../components/dashboard/RecentLostFound";
import TrendingConfessions from "../../components/confessions/TrendingConfessions";
import "./Dashboard.css";

function Dashboard() {

  const { setActiveTab, navigateToCreate, setSubView } = useNavigation();

  const [lostItems, setLostItems] = useState([]);
  const [confessions, setConfessions] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [roommatePosts, setRoommatePosts] = useState([]);

  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [subjectStats, setSubjectStats] = useState([]);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const [
          lost,
          confession,
          placement,
          roommate,
          attendanceSubjects,
          attendanceLogs
        ] = await Promise.all([
          lostFoundService.getItems(),
          confessionService.getConfessions(),
          placementService.getExperiences(),
          roommateService.getPosts(),
          attendanceService.getSubjects(),
          attendanceService.getLogs()
        ]);

        // Dashboard cards
        setLostItems(lost ?? []);
        setConfessions(confession ?? []);
        setPlacements(placement ?? []);
        setRoommatePosts(roommate ?? []);

        // Overall attendance
        const overall = calculateOverallStats(
            attendanceSubjects ?? [],
            attendanceLogs ?? []
        );

        setAttendancePercentage(overall.percentage);

        // Subject-wise attendance
        const subjectWise = (attendanceSubjects ?? []).map(subject => {

          const logs = (attendanceLogs ?? []).filter(
              log => log.subject?.id === subject.id
          );

          const total = logs.length;

          const attended = logs.filter(
              log =>
                  log.status === "PRESENT" ||
                  log.status === "LATE"
          ).length;

          return {
            id: subject.id,
            name: subject.name,
            percentage:
                total > 0
                    ? Math.round((attended / total) * 100)
                    : 0
          };

        });

        setSubjectStats(subjectWise);

      } catch (error) {

        console.error("Dashboard Error:", error);

      }

    };

    loadDashboard();

  }, []);

  return (
      <div className="dashboard-container">

        {/* 1. Welcome Back Banner */}
        <div className="welcome-banner">
          <h1 className="welcome-title">Welcome Back 👋</h1>
          <p className="welcome-subtitle">
            Manage your college life, stay updated with campus events, and connect with your peers from one central ecosystem.
          </p>
          <div className="welcome-actions">
            <button
                className="welcome-btn"
                onClick={() => {
                  setActiveTab("Lost & Found");
                  navigateToCreate();
                }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" />
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" />
              </svg>
              Add Lost Item
            </button>
            <button className="welcome-btn" onClick={() => setActiveTab("Anonymous Confessions")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              Post Confession
            </button>
            <button className="welcome-btn" onClick={() => { setActiveTab("Placement Portal"); navigateToCreate(); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Add Experience
            </button>
          </div>
        </div>

        {/* 2. Stats Grid (4 columns) */}
        <div className="stats-grid">

          {/* Stat 1: Lost & Found */}
          <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("Lost & Found")}>
            <div className="stat-header">
              <div className="stat-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span className="stat-badge">+3 today</span>
            </div>
            <p className="stat-label">Lost & Found</p>
            <h3 className="stat-value">{lostItems.length}</h3>          </div>

          {/* Stat 2: Confessions */}
          <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("Anonymous Confessions")}>
            <div className="stat-header">
              <div className="stat-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span className="stat-badge">Trending</span>
            </div>
            <p className="stat-label">Confessions</p>
            <h3 className="stat-value">
              {confessions.length}
            </h3>
          </div>

          {/* Stat 3: Experiences */}
          <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("Placement Portal")}>
            <div className="stat-header">
              <div className="stat-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </div>
              <span className="stat-badge">New Hires</span>
            </div>
            <p className="stat-label">Experiences</p>
            <h3 className="stat-value">
              {placements.length}
            </h3>          </div>

          {/* Stat 4: Attendance */}
          <div className="stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("Attendance Tracker")}>
            <div className="stat-header">
              <div className="stat-icon-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <span className="stat-badge-good">Good</span>
            </div>
            <p className="stat-label">Attendance</p>
            <h3 className="stat-value">
              {attendancePercentage}%
            </h3>          </div>

        </div>

        {/* 3. Main Split Grid */}
        <div className="dashboard-main-grid">

          {/* Left Column (col-span-2) */}
          <div className="main-column">

            {/* Card: Recent Lost & Found Widget */}
            <RecentLostFound />

            {/* Sub-grid: Trending & Placements */}
            <div className="sub-grid">

              {/* Trending Confessions Widget */}
              <TrendingConfessions />

              {/* Placements */}
              <div className="section-card">
                <div className="section-header">
                  <h2 className="section-title">Placements</h2>
                  <button
                      onClick={() => setActiveTab("Placement Portal")}
                      className="section-link"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    View All
                  </button>
                </div>

                <div className="list-container">
                  {placements.length > 0 ? (

                      placements.slice(0, 2).map((placement) => (

                          <div
                              className="placement-item"
                              key={placement.id}
                              onClick={() => setActiveTab("Placement Portal")}
                          >
                            <div className="item-left">
                              <div
                                  className={`placement-logo ${
                                      placement.companyName
                                          ? placement.companyName.toLowerCase() + "-logo"
                                          : "default-logo"
                                  }`}
                              >
                                {placement.companyName
                                    ? placement.companyName.charAt(0).toUpperCase()
                                    : "?"}
                              </div>
                              <div className="item-details">
                                <h4 className="item-title">
                                  {placement.companyName} {placement.role}
                                </h4>
                                <p className="item-subtitle">
                                  {placement.experienceText
                                      ? placement.experienceText.slice(0, 40) + "..."
                                      : "Experience Shared"}
                                </p>
                              </div>
                            </div>
                            <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </div>

                      ))

                  ) : (

                      <div
                          style={{
                            width: "100%",
                            textAlign: "center",
                            padding: "25px",
                            color: "#888"
                          }}
                      >
                        No placement experiences available.
                      </div>

                  )}
                </div>
              </div>

            </div>

            {/* Roommate Suggestions */}
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">Roommate Suggestions</h2>

                <button
                    onClick={() => setActiveTab("Roommate Finder")}
                    className="section-link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer"
                    }}
                >
                  Find More
                </button>
              </div>

              <div className="roommate-grid">

                {roommatePosts.length > 0 ? (

                    roommatePosts.slice(0, 3).map((post) => (

                        <div
                            key={post.id}
                            className="roommate-card"
                            onClick={() => setActiveTab("Roommate Finder")}
                        >

                          <img
                              src={
                                  post.avatar ||
                                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
                              }
                              alt={post.contactName}
                              className="roommate-avatar"
                          />

                          <h4 className="roommate-name">
                            {post.contactName}
                          </h4>

                          <p className="roommate-sub">
                            {post.location} • ₹{post.rent}
                          </p>

                          <div className="tag-group">
                            {(post.tags || []).slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="tag"
                                >
                {tag}
              </span>
                            ))}
                          </div>

                          <button
                              className="btn-connect"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab("Roommate Finder");
                              }}
                          >
                            Connect
                          </button>

                        </div>

                    ))

                ) : (

                    <div
                        style={{
                          width: "100%",
                          textAlign: "center",
                          padding: "25px",
                          color: "#888"
                        }}
                    >
                      No roommate listings available.
                    </div>

                )}

              </div>
            </div>

          </div>

          {/* Right Column (col-span-1) */}
          <div className="side-column">

            {/* Quick Actions Card */}
            <div className="section-card">
              <h2 className="section-title">Quick Actions</h2>
              <div style={{ height: "16px" }}></div>

              <div className="quick-actions-grid">
                <button
                    className="action-btn"
                    onClick={() => {
                      setActiveTab("Lost & Found");
                      navigateToCreate();
                    }}
                >
                  <div className="action-btn-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <span className="action-btn-label">Lost Item</span>
                </button>

                <button className="action-btn" onClick={() => setActiveTab("Anonymous Confessions")}>
                  <div className="action-btn-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="5" y="2" width="14" height="20" rx="2" />
                      <line x1="9" y1="7" x2="15" y2="7" />
                      <line x1="9" y1="11" x2="15" y2="11" />
                    </svg>
                  </div>
                  <span className="action-btn-label">Confess</span>
                </button>

                <button className="action-btn" onClick={() => setActiveTab("Attendance Tracker")}>
                  <div className="action-btn-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </div>
                  <span className="action-btn-label">Attendance</span>
                </button>

                <button className="action-btn" onClick={() => { setActiveTab("Placement Portal"); navigateToCreate(); }}>
                  <div className="action-btn-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </div>
                  <span className="action-btn-label">Experience</span>
                </button>
              </div>
            </div>

            {/* Attendance Tracker progress bar card */}
            <div
                className="section-card"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("Attendance Tracker")}
            >
              <div className="section-header">
                <div>
                  <h2 className="section-title">Attendance</h2>
                  <p className="item-subtitle">Target: 75% overall</p>
                </div>

                <div className="attendance-avg-container">
                  <div className="attendance-avg">
                    {attendancePercentage}%
                  </div>
                  <div className="attendance-avg-label">Avg</div>
                </div>
              </div>

              <div className="progress-bars">

                {subjectStats.length > 0 ? (

                    subjectStats.map((subject) => (

                        <div
                            className="progress-bar-wrapper"
                            key={subject.id}
                        >
                          <div className="progress-bar-info">
                            <span>{subject.name}</span>
                            <span>{subject.percentage}%</span>
                          </div>

                          <div className="progress-track">
                            <div
                                className="progress-indicator"
                                style={{
                                  width: `${subject.percentage}%`
                                }}
                            ></div>
                          </div>

                        </div>

                    ))

                ) : (

                    <p
                        style={{
                          textAlign: "center",
                          color: "var(--muted)",
                          padding: "15px"
                        }}
                    >
                      No attendance data available.
                    </p>

                )}

                <button
                    className="btn-detailed"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("Attendance Tracker");
                    }}
                >
                  Open Tracker
                </button>

              </div>
            </div>



          </div>

        </div>

      </div>
  );
}

export default Dashboard;