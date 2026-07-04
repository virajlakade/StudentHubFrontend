import { useNavigation } from "../../context/NavigationContext";
import "./LostFoundCard.css";

export default function LostFoundCard({ item }) {
  const { navigateToDetails } = useNavigation();

  const truncate = (text, maxLength = 80) => {
    if (!text) return "";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
  };

  return (
      <div
          className="lost-found-card"
          onClick={() => navigateToDetails(item.id)}
      >
        {/* Image */}
        <div className="card-image-wrapper">
          <img
              src={
                  item.image ||
                  "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?q=80&w=600&auto=format&fit=crop"
              }
              alt={item.title}
              className="card-image"
              onError={(e) => {
                e.target.src =
                    "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?q=80&w=600&auto=format&fit=crop";
              }}
          />

          <span className={`status-badge ${item.status?.toLowerCase()}`}>
          {item.status}
        </span>
        </div>

        {/* Card Content */}
        <div className="card-content">

          <div className="card-header-row">
            <h3 className="card-title">
              {item.title}
            </h3>

            <span className="card-time">
            {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : ""}
          </span>
          </div>

          <div className="card-location">
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="location-pin-icon"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>

            <span className="location-text">
            {item.location}
          </span>
          </div>

          <p className="card-description">
            {truncate(item.description)}
          </p>

          <div className="card-action-btn-container">
            <button className="card-action-btn">
              View Details

              <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="btn-arrow"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

        </div>
      </div>
  );
}