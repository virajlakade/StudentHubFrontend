import { useEffect, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { lostFoundService } from "../../services/lostFoundService";
import { profileService } from "../../services/profileService";
import "./LostFoundDetails.css";

const BASE_URL = "http://localhost:8090";

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
      if (!selectedItemId) return;

      try {
        const data = await lostFoundService.getItemById(selectedItemId);
        console.log("Item:", data);
        setItem(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchItem();
  }, [selectedItemId]);

  const handleAction = async () => {
    try {
      await lostFoundService.claimItem(item.id);

      setActionSent(true);

      alert(
          `Your request has been sent to ${item.contactName}. They will receive an email notification at ${item.contactEmail}.`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to send request.");
    } finally {
      setActionSent(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    try {
      await lostFoundService.deleteItem(item.id);
      navigateToList();
    } catch (err) {
      console.error(err);
      alert("Failed to delete listing.");
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
            <p>The requested item does not exist.</p>
          </div>
        </div>
    );
  }

  const imageUrl = item.image
      ? `${BASE_URL}${item.image}`
      : "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?q=80&w=600&auto=format&fit=crop";

  return (
      <div className="lost-found-details-page">

        <div className="details-header">
          <button onClick={navigateToList} className="btn-back">
            ← Back to Listings
          </button>
        </div>

        <div className="details-grid">

          <div className="details-image-container">
            <img
                src={imageUrl}
                alt={item.title}
                className="details-large-image"
                onError={(e) => {
                  e.target.src =
                      "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?q=80&w=600&auto=format&fit=crop";
                }}
            />
          </div>

          <div className="details-info-container">

            <div className="details-badges">
            <span
                className={`detail-status-badge ${item.status.toLowerCase()}`}
            >
              {item.status.toUpperCase()}
            </span>

              <span className="detail-category-badge">
              {item.category}
            </span>
            </div>

            <h1 className="details-title">{item.title}</h1>

            <div className="details-meta">
              Posted {new Date(item.createdAt).toLocaleDateString()}
            </div>

            <div className="details-location">
              📍 {item.location}
            </div>

            <div className="details-description-section">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>

            <div className="details-contact-card">

              <h3>Contact Information</h3>

              <div className="contact-row">
                <span>Reported By:</span>
                <span>{item.contactName}</span>
              </div>

              <div className="contact-row">
                <span>Email:</span>
                <span>{item.contactEmail}</span>
              </div>

              {isOwner ? (
                  <button
                      className="btn-delete-action"
                      onClick={handleDelete}
                  >
                    Delete Listing
                  </button>
              ) : (
                  <button
                      disabled={actionSent}
                      onClick={handleAction}
                      className={`btn-contact-action ${item.status.toLowerCase()}`}
                  >
                    {item.status.toUpperCase() === "LOST"
                        ? "I Found This Item"
                        : "Claim This Item"}
                  </button>
              )}

            </div>

          </div>

        </div>

      </div>
  );
}