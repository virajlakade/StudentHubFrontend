import React from "react";
import "./RoommateStats.css";

export function RoommateStats({ posts = [], requests = [] }) {
  const totalPosts = posts.length;

  // Total accepted roommate requests
  const matchesMade = requests.filter(
      (req) => req.status?.toUpperCase() === "ACCEPTED"
  ).length;

  return (
      <div className="roommate-stats-grid">

        {/* Total Listings */}
        <div className="roommate-stat-card glass-card">
          <div className="stat-icon-container blue-theme">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>

          <div className="stat-details">
            <span className="stat-value">{totalPosts}</span>
            <span className="stat-label">Total Listings</span>
          </div>
        </div>

        {/* Matches Made */}
        <div className="roommate-stat-card glass-card">
          <div className="stat-icon-container orange-theme">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>

          <div className="stat-details">
            <span className="stat-value">{matchesMade}</span>
            <span className="stat-label">Matches Made</span>
          </div>
        </div>

      </div>
  );
}

export default RoommateStats;