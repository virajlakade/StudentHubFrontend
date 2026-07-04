import { useState } from "react";
import ConfessionCard from "./ConfessionCard";
import "./ConfessionFeed.css";

export default function ConfessionFeed({
                                           items = [],
                                           onLike,
                                       }) {

    const [visibleCount, setVisibleCount] = useState(5);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    const visibleItems = items.slice(0, visibleCount);

    const hasMore =
        items.length > visibleCount;

    if (!items || items.length === 0) {
        return (
            <div className="conf-empty-feed">

                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="conf-empty-icon"
                >
                    <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                    />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>

                <h4>No confessions found</h4>

                <p>
                    No secrets here yet.
                    Be the first to share one!
                </p>

            </div>
        );
    }

    return (
        <div className="conf-feed-container">

            <div className="conf-feed-grid">

                {visibleItems.map((item) => (

                    <ConfessionCard
                        key={item.id}
                        item={item}
                        onLike={onLike}
                    />

                ))}

            </div>

            {hasMore && (

                <div className="conf-load-more-wrapper">

                    <button
                        onClick={handleLoadMore}
                        className="conf-btn-load-more"
                    >
                        Load More Secrets
                    </button>

                </div>

            )}

        </div>
    );
}