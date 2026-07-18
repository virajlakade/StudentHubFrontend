import React, { useState, useEffect } from "react";
import { profileService } from "../../services/profileService";
import "./ExperienceCard.css";

export function ExperienceCard({ experience, onLike, onDelete }) {
  const {
    id,
    companyName,
    role,
    year,
    type,
    authorName,
    authorEmail,
    difficulty,
    selectionStatus,
    rounds,
    experienceText,
    tips,
    createdAt,
    likes,
    likedByUser
  } = experience;

  const [isExpanded, setIsExpanded] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await profileService.getProfile();
        setProfile(p);
      } catch (err) {
        console.error(err);
      }
    }

    loadProfile();
  }, []);

  const isOwner =
      authorEmail &&
      profile?.email &&
      authorEmail.trim().toLowerCase() ===
      profile.email.trim().toLowerCase();

  const getCompanyClass = () => {
    const name = (companyName || "").toLowerCase();

    if (name.includes("google")) return "google-brand";
    if (name.includes("amazon")) return "amazon-brand";
    if (name.includes("microsoft")) return "microsoft-brand";

    return "default-brand";
  };

  const getCompanyInitial = () => {
    return companyName ? companyName.charAt(0).toUpperCase() : "?";
  };

  const getDifficultyClass = () => {
    const diff = (difficulty || "").toLowerCase();

    switch (diff) {
      case "easy":
        return "diff-easy";

      case "medium":
        return "diff-medium";

      case "hard":
        return "diff-hard";

      default:
        return "diff-medium";
    }
  };

  const getStatusClass = () => {
    const status = (selectionStatus || "").toLowerCase();

    switch (status) {
      case "selected":
        return "status-selected";

      case "not selected":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  return (
      <div className="experience-card glass-card">

        <div className="exp-card-header">
          <div className="header-company-info">
            <div className={`company-logo-badge ${getCompanyClass()}`}>
              {getCompanyInitial()}
            </div>

            <div className="title-details">
              <h3 className="company-name-title">
                {companyName || "Unknown Company"}
              </h3>

              <p className="role-sub-title">
                {role || "N/A"} ({year || "N/A"})
              </p>
            </div>
          </div>

          <div className="header-meta-time">
          <span className="meta-time-badge">
            {createdAt
                ? new Date(createdAt).toLocaleDateString()
                : "Just now"}
          </span>
          </div>
        </div>

        <div className="exp-badges-row">
        <span className="exp-badge type-badge">
          {type || "N/A"}
        </span>

          <span className={`exp-badge ${getDifficultyClass()}`}>
          {difficulty || "Medium"}
        </span>

          <span className={`exp-badge ${getStatusClass()}`}>
          {selectionStatus || "Pending"}
        </span>
        </div>

        <div className="exp-body-content">
          <p
              className={`exp-main-paragraph ${
                  isExpanded ? "expanded" : "collapsed"
              }`}
          >
            {experienceText}
          </p>

          {isExpanded && (
              <div className="expanded-details-section">
                {rounds && (
                    <div className="rounds-detail-group">
                      <h4 className="detail-section-title">
                        Rounds & Interview Process
                      </h4>

                      <p className="rounds-text-content">
                        {rounds}
                      </p>
                    </div>
                )}

                {tips && (
                    <div className="rounds-detail-group">
                      <h4 className="detail-section-title">
                        Preparation Tips
                      </h4>

                      <p className="tips-text-content">
                        {tips}
                      </p>
                    </div>
                )}
              </div>
          )}

          <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn-read-more"
          >
            {isExpanded
                ? "Show Less ▲"
                : "Read Full Experience ▼"}
          </button>
        </div>

        <div className="exp-card-footer">
        <span className="author-name-tag">
          By <strong>{authorName || "Anonymous"}</strong>
        </span>

          <div className="footer-actions">

            {isOwner && (
                <button
                    onClick={() => onDelete(id)}
                    className="delete-action-btn"
                    title="Delete Experience"
                >
                  🗑
                </button>
            )}

            <button
                onClick={() => onLike(id)}
                className={`like-action-btn ${
                    likedByUser ? "liked" : ""
                }`}
            >
              👍 {likes || 0}
            </button>

          </div>
        </div>

      </div>
  );
}

export default ExperienceCard;