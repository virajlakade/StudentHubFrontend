import { useEffect, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { lostFoundService } from "../../services/lostFoundService";
import { profileService } from "../../services/profileService";
import "./LostFoundDetails.css";

export default function LostFoundDetails() {
  const { selectedItemId, navigateToList } = useNavigation();
  const [item, setItem] = useState(null);
  const [actionSent, setActionSent] = useState(false);

  const profile = profileService.getProfile();
  const isOwner =
      item &&
      profile &&
      item.contactEmail &&
      profile.email &&
      item.contactEmail.toLowerCase().trim() ===
      profile.email.toLowerCase().trim();

  useEffect(() => {
    const fetchItem = async () => {
      if (selectedItemId) {
        try {
          const fetchedItem = await lostFoundService.getItemById(selectedItemId);
          setItem(fetchedItem);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchItem();
  }, [selectedItemId]);

  const handleAction = () => {
    setActionSent(true);
    setTimeout(() => {
      setActionSent(false);
      alert(
        `Your request has been sent to ${item.contactName}. They will receive an email notification at ${item.contactEmail}.`
      );
    }, 100);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await lostFoundService.deleteItem(item.id);
        navigateToList();
      } catch (error) {
        console.error(error);
        alert("Failed to delete the listing.");
      }
    }
  };
  if (!item) {
    return (
      <div className="details-error-page">
        <button onClick={navigateToList} className="btn-back">
          Back to Listings
        </button>
        <div className="details-error-message">
          <h3>Item not found</h3>
          <p>The item you are looking for does not exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lost-found-details-page">
      {/* Back Header */}
      <div className="details-header">
        <button onClick={navigateToList} className="btn-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="back-arrow-icon">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Listings
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="details-grid">
        {/* Left Column: Image */}
        <div className="details-image-container">
          <img
            src={item.image}
            alt={item.title}
            className="details-large-image"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?q=80&w=600&auto=format&fit=crop";
            }}
          />
        </div>

        {/* Right Column: Information */}
        <div className="details-info-container">
          <div className="details-badges">
            <span className={`detail-status-badge ${item.status.toLowerCase()}`}>
              {item.status.toUpperCase()}
            </span>
            <span className="detail-category-badge">{item.category}</span>
          </div>

          <h1 className="details-title">{item.title}</h1>
          <div className="details-meta">
            <span className="details-time">

              Posted {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Location */}
          <div className="details-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pin-icon">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{item.location}</span>
          </div>

          {/* Description */}
          <div className="details-description-section">
            <h3 className="section-subtitle-label">Description</h3>
            <p className="details-description-text">{item.description}</p>
          </div>

          {/* Contact & Action Card */}
          <div className="details-contact-card">
            <h3 className="contact-card-title">Contact Information</h3>
            <div className="contact-row">
              <span className="contact-label-name">Reported By:</span>
              <span className="contact-value-name">{item.contactName}</span>
            </div>
            <div className="contact-row">
              <span className="contact-label-name">Email:</span>
              <span className="contact-value-name">{item.contactEmail}</span>
            </div>

            {isOwner ? (
              <button
                onClick={handleDelete}
                className="btn-delete-action"
              >
                Delete Listing
              </button>
            ) : (
              <button
                onClick={handleAction}
                disabled={actionSent}
                className={`btn-contact-action ${item.status.toLowerCase()}`}
              >
                {item.status === "lost" ? "I Found This Item" : "Claim This Item"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
