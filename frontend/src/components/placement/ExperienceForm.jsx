import React, { useState } from "react";
import "./ExperienceForm.css";

export function ExperienceForm({ onSubmit, onCancel }) {

  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const [type, setType] = useState("INTERNSHIP");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [selectionStatus, setSelectionStatus] = useState("SELECTED");

  const [rounds, setRounds] = useState("");
  const [experienceText, setExperienceText] = useState("");
  const [tips, setTips] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();
    setError("");

    if (
      !companyName.trim() ||
      !role.trim() ||
      !experienceText.trim()
    ) {
      setError(
        "Please fill Company Name, Role and Experience."
      );
      return;
    }

    onSubmit({
      companyName: companyName.trim(),
      role: role.trim(),
      year: Number(year),
      type,
      difficulty,
      selectionStatus,
      rounds: rounds.trim(),
      experienceText: experienceText.trim(),
      tips: tips.trim(),
      authorName: authorName.trim() || "Anonymous",
      authorEmail: authorEmail.trim(),
      likes: 0,
      likedByUser: false
    });

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="experience-form-container glass-card"
    >

      <h2 className="form-title-text">
        Share Interview Experience
      </h2>

      <p className="form-subtitle-text">
        Help juniors by sharing your placement journey.
      </p>

      {error && (
        <div className="form-alert-error">
          {error}
        </div>
      )}

      {/* Company & Role */}

      <div className="form-row-two-columns">

        <div className="form-input-group flex-2">

          <label className="input-field-label">
            Company Name *
          </label>

          <input
            type="text"
            className="form-text-input"
            placeholder="Google, Amazon..."
            value={companyName}
            onChange={(e) =>
              setCompanyName(e.target.value)
            }
          />

        </div>

        <div className="form-input-group flex-2">

          <label className="input-field-label">
            Job Role *
          </label>

          <input
            type="text"
            className="form-text-input"
            placeholder="Software Engineer"
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          />

        </div>

      </div>

      {/* Year Type Difficulty */}

      <div className="form-row-three-columns">

        <div className="form-input-group">

          <label className="input-field-label">
            Interview Year
          </label>

          <input
            type="number"
            className="form-text-input"
            value={year}
            onChange={(e) =>
              setYear(e.target.value)
            }
          />

        </div>

        <div className="form-input-group">

          <label className="input-field-label">
            Job Type
          </label>

          <select
            className="form-select-input"
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            <option value="INTERNSHIP">
              Internship
            </option>

            <option value="FULL_TIME">
              Full Time
            </option>

            <option value="PPO">
              PPO
            </option>

          </select>

        </div>

        <div className="form-input-group">

          <label className="input-field-label">
            Difficulty
          </label>

          <select
            className="form-select-input"
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
          >

            <option value="EASY">
              Easy
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HARD">
              Hard
            </option>

          </select>

        </div>

      </div>

      {/* Status */}

      <div className="form-row-two-columns">

        <div className="form-input-group">

          <label className="input-field-label">
            Result
          </label>

          <select
            className="form-select-input"
            value={selectionStatus}
            onChange={(e) =>
              setSelectionStatus(e.target.value)
            }
          >

            <option value="SELECTED">
              Selected
            </option>

            <option value="REJECTED">
              Rejected
            </option>

            <option value="WAITLISTED">
              Waitlisted
            </option>

          </select>

        </div>

        <div className="form-input-group">

          <label className="input-field-label">
            Your Name
          </label>

          <input
            type="text"
            className="form-text-input"
            value={authorName}
            onChange={(e) =>
              setAuthorName(e.target.value)
            }
          />

        </div>

      </div>

      {/* Email */}

      <div className="form-input-group">

        <label className="input-field-label">
          Email
        </label>

        <input
          type="email"
          className="form-text-input"
          value={authorEmail}
          onChange={(e) =>
            setAuthorEmail(e.target.value)
          }
        />

      </div>

      {/* Rounds */}

      <div className="form-input-group">

        <label className="input-field-label">
          Interview Rounds
        </label>

        <textarea
          rows="4"
          className="form-textarea-input"
          value={rounds}
          onChange={(e) =>
            setRounds(e.target.value)
          }
        />

      </div>

      {/* Experience */}

      <div className="form-input-group">

        <label className="input-field-label">
          Interview Experience *
        </label>

        <textarea
          rows="5"
          className="form-textarea-input"
          value={experienceText}
          onChange={(e) =>
            setExperienceText(e.target.value)
          }
        />

      </div>

      {/* Tips */}

      <div className="form-input-group">

        <label className="input-field-label">
          Tips
        </label>

        <textarea
          rows="3"
          className="form-textarea-input"
          value={tips}
          onChange={(e) =>
            setTips(e.target.value)
          }
        />

      </div>

      <div className="form-actions-row">

        <button
          type="button"
          onClick={onCancel}
          className="btn-cancel-form"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn-submit-form"
        >
          Publish Experience
        </button>

      </div>

    </form>

  );
}

export default ExperienceForm;