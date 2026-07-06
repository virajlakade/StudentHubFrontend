import React, { useState } from "react";
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

  const profile = profileService.getProfile();
  const isOwner = authorEmail && profile && authorEmail.toLowerCase().trim() === profile.email.toLowerCase().trim();

  // Generate color class based on company name
  const getCompanyClass = () => {
    const name = companyName.toLowerCase();
    if (name.includes("google")) return "google-brand";
    if (name.includes("amazon")) return "amazon-brand";
    if (name.includes("microsoft")) return "microsoft-brand";
    return "default-brand";
  };

  // Initial of company name
  const getCompanyInitial = () => {
    return companyName.charAt(0).toUpperCase();
  };

  const getDifficultyClass = () => {

    if (!difficulty) return "diff-medium";

    switch (difficulty.toLowerCase()) {

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
    switch (selectionStatus.toLowerCase()) {
      case "selected": return "status-selected";
      case "not selected": return "status-rejected";
      default: return "status-pending";
    }
  };

  return (
    <div className="experience-card glass-card">
      {/* 1. Header Info */}
      <div className="exp-card-header">
        <div className="header-company-info">
          <div className={`company-logo-badge ${getCompanyClass()}`}>
            {getCompanyInitial()}
          </div>
          <div className="title-details">
            <h3 className="company-name-title">{companyName}</h3>
            <p className="role-sub-title">{role} ({year})</p>
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

      {/* 2. Badge Details */}
      <div className="exp-badges-row">
        <span className="exp-badge type-badge">{type}</span>
        <span className={`exp-badge ${getDifficultyClass()}`}>
    {difficulty}
</span>
        <span className={`exp-badge ${getStatusClass()}`}>
          {selectionStatus}
        </span>
      </div>

      {/* 3. Text Body */}
      <div className="exp-body-content">
        <p className={`exp-main-paragraph ${isExpanded ? "expanded" : "collapsed"}`}>
          {experienceText}
        </p>

        {isExpanded && (
          <div className="expanded-details-section">
            {rounds && (
              <div className="rounds-detail-group">
                <h4 className="detail-section-title">Rounds & Interview Process</h4>
                <p className="rounds-text-content">{rounds}</p>
              </div>
            )}
            {tips && (
              <div className="rounds-detail-group">
                <h4 className="detail-section-title">Preparation Tips for Juniors</h4>
                <p className="tips-text-content">{tips}</p>
              </div>
            )}
          </div>
        )}

        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="btn-read-more"
        >
          {isExpanded ? "Show Less ▲" : "Read Full Experience ▼"}
        </button>
      </div>

      {/* 4. Footer Info */}
      <div className="exp-card-footer">
        <span className="author-name-tag">
          By <strong>{authorName}</strong>
        </span>

        <div className="footer-actions">
          {isOwner && (
            <button
              onClick={() => onDelete(id)}
              className="delete-action-btn"
              title="Delete Experience"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          )}

          <button 
            onClick={() => onLike(id)} 
            className={`like-action-btn ${likedByUser ? "liked" : ""}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={likedByUser ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            {likes}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
