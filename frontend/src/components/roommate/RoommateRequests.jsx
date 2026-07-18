import React, { useMemo, useState } from "react";
import RoommateRequestCard from "./RoommateRequestCard";
import { profileService } from "../../services/profileService";
import "./RoommateRequests.css";

export default function RoommateRequests({
                                             requests = [],
                                             onStatusChange,
                                         }) {
    const [activeSegment, setActiveSegment] = useState("received");

    const currentUser = profileService.getProfile() || {};
    const currentEmail = (currentUser.email || "").trim().toLowerCase();

    const { receivedRequests, sentRequests } = useMemo(() => {
        const received = requests.filter((req) => {
            const receiverEmail = (
                req?.receiver?.email ||
                req?.receiverEmail ||
                ""
            )
                .trim()
                .toLowerCase();

            return receiverEmail === currentEmail;
        });

        const sent = requests.filter((req) => {
            const senderEmail = (
                req?.sender?.email ||
                req?.senderEmail ||
                ""
            )
                .trim()
                .toLowerCase();

            return senderEmail === currentEmail;
        });

        return {
            receivedRequests: received,
            sentRequests: sent,
        };
    }, [requests, currentEmail]);

    const displayedRequests =
        activeSegment === "received"
            ? receivedRequests
            : sentRequests;

    return (
        <div className="roommate-requests-container">
            <div className="requests-tabs-header">
                <button
                    type="button"
                    className={`requests-tab-btn ${
                        activeSegment === "received" ? "active" : ""
                    }`}
                    onClick={() => setActiveSegment("received")}
                >
                    Received Requests
                    {receivedRequests.length > 0 && (
                        <span className="count-badge">
              {receivedRequests.length}
            </span>
                    )}
                </button>

                <button
                    type="button"
                    className={`requests-tab-btn ${
                        activeSegment === "sent" ? "active" : ""
                    }`}
                    onClick={() => setActiveSegment("sent")}
                >
                    Sent Requests
                    {sentRequests.length > 0 && (
                        <span className="count-badge">
              {sentRequests.length}
            </span>
                    )}
                </button>
            </div>

            {displayedRequests.length === 0 ? (
                <div className="requests-empty-state glass-card">

                    {/* Fixed SVG */}
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="2"
                        />
                        <path d="M3 7L12 13L21 7" />
                    </svg>

                    <h4>
                        No {activeSegment} requests found
                    </h4>

                    <p>
                        {activeSegment === "received"
                            ? "Incoming roommate requests will appear here."
                            : "Your sent roommate requests will appear here."}
                    </p>
                </div>
            ) : (
                <div className="requests-cards-grid">
                    {displayedRequests.map((request) => (
                        <RoommateRequestCard
                            key={request.id}
                            request={request}
                            onStatusChange={onStatusChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}