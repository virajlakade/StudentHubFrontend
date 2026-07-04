import { useState } from "react";
import LostFoundCard from "./LostFoundCard";
import "./LostFoundList.css";

export default function LostFoundList({ items = [] }) {

    const [visibleCount, setVisibleCount] = useState(6);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    const visibleItems = items.slice(0, visibleCount);
    const hasMore = items.length > visibleCount;

    if (!items || items.length === 0) {
        return (
            <div className="empty-list-container">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="empty-icon"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                </svg>

                <h3>No items found</h3>
                <p>Try adjusting your search query or filters.</p>
            </div>
        );
    }

    return (
        <div className="list-wrapper">

            <div className="lost-found-grid">
                {visibleItems.map((item) => (
                    <LostFoundCard
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="load-more-container">
                    <button
                        className="btn-load-more"
                        onClick={handleLoadMore}
                    >
                        Load More Items
                    </button>
                </div>
            )}

        </div>
    );
}