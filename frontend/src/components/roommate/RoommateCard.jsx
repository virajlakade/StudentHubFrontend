import React, { useState, useMemo } from "react";
import RoommateInterests from "./RoommateInterests";
import { calculateMatchScore } from "../../utils/roommateUtils";
import { profileService } from "../../services/profileService";
import "./RoommateCard.css";

export default function RoommateCard({
                                       post,
                                       requests = [],
                                       onConnect,
                                       onDelete
                                     }) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [connectMessage, setConnectMessage] = useState("");

  const currentUser = profileService.getProfile();

  const isOwnPost = useMemo(() => {

    if (!currentUser) return false;

    return (
        post.user &&
        post.user.id === currentUser.id
    );

  }, [post, currentUser]);

  const existingRequest = useMemo(() => {

    if (!currentUser) return null;

    return requests.find(req =>

        req.post &&
        req.post.id === post.id &&

        req.sender &&
        req.sender.id === currentUser.id

    );

  }, [requests, post, currentUser]);

  const userTags = ["Coding", "Gaming", "Late Night"];

  const matchScore = calculateMatchScore(
      userTags,
      post.tags || []
  );

  const handleSendRequest = e => {

    e.preventDefault();

    if (!connectMessage.trim()) return;

    onConnect(post, connectMessage);

    setShowConnectForm(false);
    setConnectMessage("");

  };

  return (

      <div className="roommate-card glass-card">

        {/* ================= HEADER ================= */}

        <div className="rm-card-header">

          <div className="creator-profile-info">

            <img
                src={
                    post.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
                }
                alt={post.contactName}
                className="creator-avatar"
                onError={(e) => {

                  e.target.src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop";

                }}
            />

            <div className="creator-details">

              <h3 className="creator-name">
                {post.contactName}
              </h3>

              <span className="creator-subtext">

              {post.degreeProgram || "Student"}

                {post.yearOfStudy &&
                    ` • Year ${post.yearOfStudy}`}

            </span>

            </div>

          </div>

          {!isOwnPost && matchScore > 0 && (

              <div className="match-score-badge">

                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>

                <span>{matchScore}% Match</span>

              </div>

          )}

        </div>

        {/* ================= BODY ================= */}

        <div className="rm-card-body">

          <h4 className="post-title">
            {post.title}
          </h4>

          <div className="post-badges-row">

          <span className="post-badge loc-badge">
            📍 {post.location}
          </span>

            <span className="post-badge rent-badge">
            ₹{post.rent}
          </span>

            <span className="post-badge gender-badge">
            {post.gender}
          </span>

            <span className="post-badge">
            {post.occupancy}
          </span>

          </div>

          <div className="post-description-container">

            <p
                className={
                  isExpanded
                      ? "post-description expanded"
                      : "post-description collapsed"
                }
            >
              {post.description}
            </p>

            {post.description &&
                post.description.length > 120 && (

                    <button
                        className="btn-read-more"
                        onClick={() =>
                            setIsExpanded(!isExpanded)
                        }
                    >
                      {isExpanded
                          ? "Show Less"
                          : "Read Full Description"}
                    </button>

                )}

          </div>

          <div className="post-interests-section">

            <RoommateInterests
                selectedTags={post.tags || []}
            />

          </div>

        </div>
        {/* ================= CONTACT INFO ================= */}

        {existingRequest &&
            existingRequest.status === "ACCEPTED" && (

                <div className="contact-reveal-box">

                  <h5 className="reveal-title">
                    🎉 You are connected!
                  </h5>

                  <div className="reveal-details">

                    <div className="reveal-item">
                      📧 {post.contactEmail}
                    </div>

                    {post.contactPhone && (
                        <div className="reveal-item">
                          📞 {post.contactPhone}
                        </div>
                    )}

                  </div>

                </div>

            )}

        {/* ================= FOOTER ================= */}

        <div className="rm-card-footer">

        <span>

          {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : "Just now"}

        </span>

          <div className="footer-actions">

            {isOwnPost ? (

                <div className="owner-badge-container">

              <span className="owner-badge">
                My Listing
              </span>

                  {onDelete && (

                      <button
                          className="btn-delete-listing"
                          onClick={() => {

                            if (
                                window.confirm(
                                    "Delete this roommate listing?"
                                )
                            ) {
                              onDelete(post.id);
                            }

                          }}
                      >
                        Delete
                      </button>

                  )}

                </div>

            ) : existingRequest ? (

                <span
                    className={`request-status-badge status-${existingRequest.status.toLowerCase()}`}
                >
              {existingRequest.status}
            </span>

            ) : (

                <button
                    className="btn-connect-action"
                    onClick={() =>
                        setShowConnectForm(
                            !showConnectForm
                        )
                    }
                >
                  Connect
                </button>

            )}

          </div>

        </div>

        {/* ================= CONNECT FORM ================= */}

        {showConnectForm && (

            <form
                className="inline-connect-form"
                onSubmit={handleSendRequest}
            >

              <div className="form-title">

                Send connection request to{" "}
                {post.contactName}

              </div>

              <textarea

                  className="connect-textarea"

                  rows="4"

                  placeholder="Write a short introduction..."

                  value={connectMessage}

                  onChange={(e) =>
                      setConnectMessage(
                          e.target.value
                      )
                  }

                  required

              />

              <div className="form-actions">

                <button
                    type="button"
                    className="btn-cancel-request"
                    onClick={() =>
                        setShowConnectForm(false)
                    }
                >
                  Cancel
                </button>

                <button
                    type="submit"
                    className="btn-send-request"
                >
                  Send Request
                </button>

              </div>

            </form>

        )}

      </div>

  );

}