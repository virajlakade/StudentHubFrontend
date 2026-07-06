import React from "react";
import { useNavigation } from "../../context/NavigationContext";
import { placementService } from "../../services/placementService";
import ExperienceForm from "../../components/placement/ExperienceForm";
import "./AddExperiencePage.css";

export function AddExperiencePage() {

  const { navigateToList } = useNavigation();

  const handleFormSubmit = async (formData) => {

    try {

      await placementService.addExperience(formData);

      navigateToList();

    } catch (error) {

      console.error("Error adding placement experience:", error);
      alert("Failed to share experience.");

    }

  };

  return (
    <div className="placement-feed-page">

      {/* Header */}

      <div className="placement-header">

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >

          <button
            onClick={navigateToList}
            className="btn-back-nav"
            title="Back to Feed"
          >

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>

          </button>

          <div className="placement-title-container">

            <h1 className="page-title">
              Share Experience
            </h1>

            <p className="page-subtitle">
              Add your interview processes and preparation guidelines.
            </p>

          </div>

        </div>

      </div>

      <ExperienceForm
        onSubmit={handleFormSubmit}
        onCancel={navigateToList}
      />

    </div>
  );
}

export default AddExperiencePage;