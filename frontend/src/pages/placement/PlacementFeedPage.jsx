import React, { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { placementService } from "../../services/placementService";
import ExperienceFeed from "../../components/placement/ExperienceFeed";
import "./PlacementFeedPage.css";

export function PlacementFeedPage() {

  const { navigateToCreate } = useNavigation();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all experiences
  useEffect(() => {

    const fetchExperiences = async () => {

      try {

        const data = await placementService.getExperiences();
        setExperiences(data);

      } catch (error) {

        console.error("Error loading placement experiences", error);

      } finally {

        setLoading(false);

      }

    };

    fetchExperiences();

  }, []);

  // Like Experience
  const handleLike = async (id) => {

    try {

      const updated = await placementService.likeExperience(id);

      setExperiences((prev) =>
          prev.map((item) =>
              item.id === id ? updated : item
          )
      );

    } catch (error) {

      console.error(error);
      alert("Failed to like the experience.");

    }

  };

  // Delete Experience
  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this experience post?"))
      return;

    try {

      await placementService.deleteExperience(id);

      setExperiences((prev) =>
          prev.filter((item) => item.id !== id)
      );

    } catch (error) {

      console.error(error);
      alert("Failed to delete experience.");

    }

  };

  if (loading) {
    return (
        <div className="placement-feed-page">
          <h2 style={{ textAlign: "center", marginTop: "100px" }}>
            Loading...
          </h2>
        </div>
    );
  }

  return (
      <div className="placement-feed-page">

        {/* Header */}

        <div className="placement-header">

          <div className="placement-title-container">

            <h1 className="page-title">
              Placement Portal
            </h1>

            <p className="page-subtitle">
              Browse SDE, analyst, and consulting interview logs shared by peers.
            </p>

          </div>

          <button
              onClick={navigateToCreate}
              className="btn-share-exp"
          >

            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>

            Share Experience

          </button>

        </div>

        <ExperienceFeed
            experiences={experiences}
            onLike={handleLike}
            onDelete={handleDelete}
        />

      </div>
  );
}

export default PlacementFeedPage;