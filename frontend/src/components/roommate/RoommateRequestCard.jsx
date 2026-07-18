import React from "react";
import { profileService } from "../../services/profileService";
import "./RoommateRequestCard.css";

export default function RoommateRequestCard({ request, onStatusChange }) {
  if (!request) return null;

  const profile = profileService.getProfile() || {};

  const isIncoming =
      request.receiver?.email === profile.email;

  const status = request.status || "PENDING";

  const displayUser = isIncoming
      ? request.sender
      : request.receiver;

  const handleAccept = () => {
    onStatusChange?.(request.id, "ACCEPTED");
  };

  const handleDecline = () => {
    onStatusChange?.(request.id, "DECLINED");
  };

  return (
      <div
          className={`roommate-request-card glass-card status-${status.toLowerCase()}`}
      >
        <div className="req-card-top">

          <div className="req-user-info">

            {displayUser?.profileImage ? (
                <img
                    src={displayUser.profileImage}
                    alt={displayUser.fullName}
                    className="req-avatar"
                />
            ) : (
                <div className="req-avatar-placeholder">
                  {(displayUser?.fullName || "?")[0]}
                </div>
            )}

            <div className="req-details">
              <h4>{displayUser?.fullName}</h4>

              <span>
              {isIncoming
                  ? "Sent you a request"
                  : "You sent this request"}
            </span>
            </div>
          </div>

          <span className={`req-status-tag tag-${status.toLowerCase()}`}>
          {status}
        </span>
        </div>

        <div className="req-card-body">

          <div className="req-post-reference">
            <span>Listing:</span>
            <span>{request.post?.title}</span>
          </div>

          {request.message && (
              <div className="req-message-box">
                {request.message}
              </div>
          )}

          {status === "ACCEPTED" && (
              <div className="req-contact-reveal">

                <p>Email : {displayUser?.email}</p>

                <p>
                  Phone : {displayUser?.phone || "Not Provided"}
                </p>

              </div>
          )}
        </div>

        {isIncoming && status === "PENDING" && (
            <div className="req-card-actions">

              <button
                  className="btn-decline-req"
                  onClick={handleDecline}
              >
                Decline
              </button>

              <button
                  className="btn-accept-req"
                  onClick={handleAccept}
              >
                Accept
              </button>

            </div>
        )}
      </div>
  );
}