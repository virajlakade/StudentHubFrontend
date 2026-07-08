import React, { useState } from "react";
import RoommateInterests from "./RoommateInterests";
import "./CreateRoommatePost.css";

const GENDERS = [
  { label: "Male Roommate", value: "MALE" },
  { label: "Female Roommate", value: "FEMALE" },
  { label: "Any Roommate", value: "ANY" }
];
export function CreateRoommatePost({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    rent: "",
    location: "",
    gender: "Any",
    description: "",
    tags: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTagsChange = (newTags) => {
    setFormData((prev) => ({
      ...prev,
      tags: newTags
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    const rentVal = String(formData.rent).replace(/[^\d]/g, "");
    if (!rentVal || parseInt(rentVal, 10) <= 0) {
      newErrors.rent = "Please enter a valid rent budget";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Please describe the room details and preferences";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-roommate-form glass-card">
      <h2 className="form-heading">Create Roommate Listing</h2>

      <div className="form-grid">
        {/* Title */}
        <div className="form-group full-width">
          <label htmlFor="title">Listing Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Seeking quiet roommate for a 2BHK flat near central canteen"
            className={errors.title ? "error" : ""}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* Rent */}
        <div className="form-group">
          <label htmlFor="rent">Rent Budget (₹ per Month) *</label>
          <input
            type="number"
            id="rent"
            name="rent"
            value={formData.rent}
            onChange={handleChange}
            placeholder="e.g. 8000"
            className={errors.rent ? "error" : ""}
          />
          {errors.rent && <span className="error-text">{errors.rent}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Hostel A, Room 302, or PG Outer Area"
            className={errors.location ? "error" : ""}
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        {/* Gender Preference */}
        <div className="form-group">
          <label htmlFor="gender">Gender Preference *</label>
          <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
          >
            {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
            ))}
          </select>
        </div>

        {/* Tags selector */}
        <div className="form-group full-width">
          <label className="tags-label">Select Habits & Interests (Click to toggle)</label>
          <div className="tags-picker-box">
            <RoommateInterests
              selectedTags={formData.tags}
              onChange={handleTagsChange}
              selectable={true}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description">Room & Flat Details *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the flat features, amenities, roommate expectations, sleep cycles, guest rules, etc."
            rows="5"
            className={errors.description ? "error" : ""}
          ></textarea>
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          Publish Requirement
        </button>
      </div>
    </form>
  );
}

export default CreateRoommatePost;
