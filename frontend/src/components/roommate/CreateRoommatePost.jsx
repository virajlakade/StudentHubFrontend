import React, { useState } from "react";
import RoommateInterests from "./RoommateInterests";
import "./CreateRoommatePost.css";

const GENDERS = [
  { label: "Male Roommate", value: "MALE" },
  { label: "Female Roommate", value: "FEMALE" },
  { label: "Any Roommate", value: "ANY" }
];

const OCCUPANCY = [
  { label: "Single Sharing", value: "SINGLE" },
  { label: "Double Sharing", value: "DOUBLE" },
  { label: "Triple Sharing", value: "TRIPLE" }
];

export default function CreateRoommatePost({ onSubmit, onCancel }) {

  const [formData, setFormData] = useState({
    title: "",
    rent: "",
    location: "",
    gender: "ANY",
    occupancy: "DOUBLE",
    status: "AVAILABLE",
    description: "",
    tags: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleTagsChange = (tags) => {
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const validate = () => {

    const err = {};

    if (!formData.title.trim())
      err.title = "Title is required";

    if (!formData.location.trim())
      err.location = "Location is required";

    if (!formData.description.trim())
      err.description = "Description is required";

    if (!formData.rent || Number(formData.rent) <= 0)
      err.rent = "Enter valid rent";

    if (!formData.occupancy)
      err.occupancy = "Select occupancy";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validate()) return;

    console.log("Submitting Roommate Post:", formData);

    onSubmit({
      ...formData,
      rent: Number(formData.rent)
    });
  };

  return (

      <form
          className="create-roommate-form glass-card"
          onSubmit={handleSubmit}
      >

        <h2 className="form-heading">
          Create Roommate Listing
        </h2>

        <div className="form-grid">

          <div className="form-group full-width">

            <label>Listing Title *</label>

            <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Looking for roommate..."
            />

            {errors.title && (
                <span className="error-text">
              {errors.title}
            </span>
            )}

          </div>

          <div className="form-group">

            <label>Rent *</label>

            <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
            />

            {errors.rent && (
                <span className="error-text">
              {errors.rent}
            </span>
            )}

          </div>

          <div className="form-group">

            <label>Location *</label>

            <input
                name="location"
                value={formData.location}
                onChange={handleChange}
            />

            {errors.location && (
                <span className="error-text">
              {errors.location}
            </span>
            )}

          </div>

          <div className="form-group">

            <label>Gender Preference</label>

            <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
            >

              {GENDERS.map(item => (

                  <option
                      key={item.value}
                      value={item.value}
                  >
                    {item.label}
                  </option>

              ))}

            </select>

          </div>

          <div className="form-group">

            <label>Occupancy *</label>

            <select
                name="occupancy"
                value={formData.occupancy}
                onChange={handleChange}
            >

              {OCCUPANCY.map(item => (

                  <option
                      key={item.value}
                      value={item.value}
                  >
                    {item.label}
                  </option>

              ))}

            </select>

            {errors.occupancy && (
                <span className="error-text">
              {errors.occupancy}
            </span>
            )}

          </div>

          <div className="form-group full-width">

            <label>Interests</label>

            <RoommateInterests
                selectable
                selectedTags={formData.tags}
                onChange={handleTagsChange}
            />

          </div>

          <div className="form-group full-width">

            <label>Description *</label>

            <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
            />

            {errors.description && (
                <span className="error-text">
              {errors.description}
            </span>
            )}

          </div>

        </div>

        <div className="form-actions">

          <button
              type="button"
              onClick={onCancel}
              className="btn-cancel"
          >
            Cancel
          </button>

          <button
              type="submit"
              className="btn-submit"
          >
            Publish Requirement
          </button>

        </div>

      </form>

  );

}