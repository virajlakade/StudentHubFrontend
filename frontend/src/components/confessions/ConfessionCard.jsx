import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { DEFAULT_CATEGORY_STYLE } from "../../data/confessionCategories";
import "./ConfessionCard.css";

export default function ConfessionCard({ item, onLike }) {

  const { navigateToDetails } = useNavigation();

  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryStyle = DEFAULT_CATEGORY_STYLE;

  const handleLikeClick = (e) => {
    e.stopPropagation();

    if (!isLiked) {
      onLike(item.id);
      setIsLiked(true);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();

    navigator.clipboard.writeText(
        `${window.location.origin}/confessions/${item.id}`
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
      <div
          className="confession-card-comp"
          onClick={() => navigateToDetails(item.id)}
      >

        {/* Category & Date */}
        <div className="card-comp-header">

        <span
            className="comp-category-badge"
            style={{
              color: categoryStyle.color,
              backgroundColor: categoryStyle.bgColor,
              borderColor: categoryStyle.borderColor
            }}
        >
          {item.category}
        </span>

          <span className="comp-card-time">
          {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : ""}
        </span>

        </div>

        {/* Confession Message */}
        <p className="comp-confession-text">
          "{item.message}"
        </p>

        {/* Footer */}
        <div className="comp-card-footer">

          {/* Like Button */}
          <button
              className={`comp-footer-stat-btn heart ${
                  isLiked ? "active" : ""
              }`}
              onClick={handleLikeClick}
              title="Like"
          >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={isLiked ? "#f472b6" : "none"}
                stroke={isLiked ? "#f472b6" : "currentColor"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="heart-icon"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>

            <span>{item.likes || 0}</span>

          </button>

          {/* Comments */}
          <button
              className="comp-footer-stat-btn message"
              onClick={(e) => {
                e.stopPropagation();
                navigateToDetails(item.id);
              }}
              title="Comments"
          >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>

            <span>
            {item.comments
                ? item.comments.length
                : 0}
          </span>

          </button>

          {/* Share */}
          <button
              className="comp-footer-stat-btn share"
              onClick={handleShareClick}
              title="Copy Link"
          >

            {copied ? (

                <span className="copied-text">
              Copied!
            </span>

            ) : (

                <>
                  <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line
                        x1="8.59"
                        y1="13.51"
                        x2="15.42"
                        y2="17.49"
                    />
                    <line
                        x1="15.41"
                        y1="6.51"
                        x2="8.59"
                        y2="10.49"
                    />
                  </svg>

                  <span>Share</span>
                </>

            )}

          </button>

        </div>

      </div>
  );
}