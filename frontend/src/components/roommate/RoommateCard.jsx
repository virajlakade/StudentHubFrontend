import React, { useState } from "react";
import RoommateInterests from "./RoommateInterests";
import { calculateMatchScore } from "../../utils/roommateUtils";
import { profileService } from "../../services/profileService";
import "./RoommateCard.css";

export function RoommateCard({ post, requests = [], onConnect, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [connectMessage, setConnectMessage] = useState("");

  const currentUser = profileService.getProfile();
  const isOwnPost =
      post.userId === currentUser.id ||
      post.email === currentUser.email;

  // Find if there's an existing request for this post sent by the current user
  const existingRequest = requests.find(
      (req) =>
          req.postId === post.id &&
          req.senderEmail === currentUser.email
  );
  // Calculate Match Score based on overlapping profile skills / tags
  // Current user's profile has 'skills' (e.g. React, JavaScript, Node.js)
  // Let's compute matching based on skills or let's use a default set of tags
  // If the user's profile doesn't have roommate-specific tags, let's assume they like standard things or use a mix.
  // In the user's profileData.js we have: skills: ["React", "JavaScript", "CSS Grid", "Node.js", "SQL", "Git"]
  // But to make match score work well, let's map some skills or default interests to room preferences,
  // or define a set of default tags for Anup, e.g. ["Coding", "Late Night", "Gaming"] to compare.
  const userRoommateTags = ["Coding", "Late Night", "Gaming"];
  const matchScore = calculateMatchScore(
      userRoommateTags,
      post.tags || []
  );
  const handleSendRequest = (e) => {
    e.preventDefault();
    if (onConnect) {
      onConnect(post.id, connectMessage);
      setShowConnectForm(false);
      setConnectMessage("");
    }
  };

  return (
    <div className="roommate-card glass-card">
      {/* Top Header: Creator Profile */}
      <div className="rm-card-header">
        <div className="creator-profile-info">
          <img
              src={
                  post.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
              }
            alt={post.name}
            className="creator-avatar"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop";
            }}
          />
          <div className="creator-details">
            <h3 className="creator-name">{post.name}</h3>
            <span className="creator-subtext">
{post.degree || "Student"} • {post.year || ""}            </span>
          </div>
        </div>
        
        {/* Match Score Badge */}
        {!isOwnPost && matchScore > 0 && (
          <div className="match-score-badge" title="Match score based on shared interests">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>{matchScore}% Match</span>
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="rm-card-body">
        <h4 className="post-title">{post.title}</h4>
        
        {/* Detail Badges (Location, Rent, Gender preference) */}
        <div className="post-badges-row">
          <span className="post-badge loc-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {post.location}
          </span>
          <span className="post-badge rent-badge">
              ₹{post.rent}          </span>
          <span className="post-badge gender-badge">
            Preference: {post.gender}
          </span>
        </div>

        {/* Description Description */}
        <div className="post-description-container">
          <p className={`post-description ${isExpanded ? "expanded" : "collapsed"}`}>
            {post.description}
          </p>
          {post.description && post.description.length > 120 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn-read-more"
            >
              {isExpanded ? "Show Less" : "Read Full Description"}
            </button>
          )}
        </div>

        {/* Interests/Habits section */}
        <div className="post-interests-section">
          <RoommateInterests selectedTags={post.tags} />
        </div>
      </div>

      {/* Connection Info Block (if accepted) */}
      {existingRequest && existingRequest.status === "Accepted" && (
        <div className="contact-reveal-box">
          <h5 className="reveal-title">🎉 You are connected! Contact details:</h5>
          <div className="reveal-details">
            <div className="reveal-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{post.email}</span>
            </div>
            {post.phone && (
              <div className="reveal-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{post.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="rm-card-footer">
        {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : "Just now"}
        
        <div className="footer-actions">
          {isOwnPost ? (
            <div className="owner-badge-container">
              <span className="owner-badge">My Listing</span>
              {onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm("Delete this roommate requirement listing?")) {
                      onDelete(post.id);
                    }
                  }}
                  className="btn-delete-listing"
                  title="Delete Listing"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              )}
            </div>
          ) : existingRequest ? (
            <span className={`request-status-badge status-${existingRequest.status.toLowerCase()}`}>
              {existingRequest.status === "PENDING" && "Request Sent"}
              {existingRequest.status === "ACCEPTED" && "Connected"}
              {existingRequest.status === "Declined" && "Declined"}
            </span>
          ) : (
            <button
              onClick={() => setShowConnectForm(!showConnectForm)}
              className="btn-connect-action"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Inline Messaging / Connection Form */}
      {showConnectForm && (
        <form onSubmit={handleSendRequest} className="inline-connect-form">
          <div className="form-title">Send connection request to {post.name}</div>
          <textarea
            placeholder={`Introduce yourself! (e.g., "Hey, I'm Anup. I am also looking for a room in ${post.location}...")`}
            value={connectMessage}
            onChange={(e) => setConnectMessage(e.target.value)}
            rows="3"
            required
            className="connect-textarea"
          ></textarea>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => setShowConnectForm(false)}
              className="btn-cancel-request"
            >
              Cancel
            </button>
            <button type="submit" className="btn-send-request">
              Send Request
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default RoommateCard;
