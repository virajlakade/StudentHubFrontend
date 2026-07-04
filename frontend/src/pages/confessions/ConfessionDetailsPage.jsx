import { useEffect, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { useConfessions } from "../../hooks/useConfessions";
import ConfessionCard from "../../components/confessions/ConfessionCard";
import ConfessionComments from "../../components/confessions/ConfessionComments";
import "./ConfessionDetailsPage.css";

export default function ConfessionDetailsPage() {

  const { selectedItemId, navigateToList } =
      useNavigation();

  const { confessions, likeConfession } =
      useConfessions();

  const [item, setItem] =
      useState(null);

  useEffect(() => {

    if (
        selectedItemId &&
        Array.isArray(confessions)
    ) {

      const match =
          confessions.find(
              (confession) =>
                  confession.id === selectedItemId
          );

      setItem(match || null);

    }

  }, [
    selectedItemId,
    confessions
  ]);

  if (!item) {

    return (

        <div className="conf-details-error">

          <button
              onClick={navigateToList}
              className="btn-back"
          >
            Back to Timeline
          </button>

          <div className="conf-error-box">

            <h3>
              Confession not found
            </h3>

            <p>
              The post you are trying to
              view does not exist or was
              deleted.
            </p>

          </div>

        </div>

    );
  }

  return (

      <div className="conf-details-page">

        <div className="conf-details-header">

          <button
              onClick={navigateToList}
              className="btn-back"
          >

            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="back-arrow-icon"
            >
              <line
                  x1="19"
                  y1="12"
                  x2="5"
                  y2="12"
              />
              <polyline
                  points="12 19 5 12 12 5"
              />
            </svg>

            Back to Timeline

          </button>

        </div>

        <div className="conf-details-content">

          <div className="conf-details-card-wrapper">

            <ConfessionCard
                item={item}
                onLike={likeConfession}
            />

          </div>

          <div className="conf-details-comments-wrapper">

            <ConfessionComments
                confessionId={item.id}
            />

          </div>

        </div>

      </div>

  );
}