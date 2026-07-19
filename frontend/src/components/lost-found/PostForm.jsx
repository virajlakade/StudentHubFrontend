import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { lostFoundService } from "../../services/lostFoundService";
import "./PostForm.css";

const CATEGORIES = [
  "Electronics",
  "Documents",
  "Books",
  "Keys",
  "Personal",
  "Other"
];

export default function PostForm() {

  const { navigateToList } = useNavigation();

  const [formData, setFormData] = useState({
    title: "",
    status: "lost",
    category: "Electronics",
    location: "",
    description: "",
    image: null,
    contactName: "",
    contactEmail: ""
  });

  const [preview, setPreview] = useState(null);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));

    }

  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {

      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, JPEG and PNG files are allowed."
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file
    }));

    setPreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      image: ""
    }));

  };

  const validate = () => {

    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      await lostFoundService.addItem({
        ...formData,
        status: formData.status.toUpperCase()
      });

      navigateToList();

    } catch (error) {

      console.error(error);

      alert("Failed to publish the post.");

    }

  };
  return (
      <form onSubmit={handleSubmit} className="post-form">

        <h2 className="form-heading">Create New Post</h2>

        <div className="form-grid">

          {/* Title */}

          <div className="form-group full-width">

            <label htmlFor="title">Item Title *</label>

            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Student ID Card, Wireless Earbuds"
                className={errors.title ? "error" : ""}
            />

            {errors.title && (
                <span className="error-text">
            {errors.title}
          </span>
            )}

          </div>

          {/* Status */}

          <div className="form-group">

            <label htmlFor="status">Status *</label>

            <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>

          </div>

          {/* Category */}

          <div className="form-group">

            <label htmlFor="category">Category *</label>

            <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
            >

              {CATEGORIES.map((cat) => (

                  <option key={cat} value={cat}>
                    {cat}
                  </option>

              ))}

            </select>

          </div>

          {/* Location */}

          <div className="form-group full-width">

            <label htmlFor="location">Location *</label>

            <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Canteen, Library, Hostel"
                className={errors.location ? "error" : ""}
            />

            {errors.location && (
                <span className="error-text">
            {errors.location}
          </span>
            )}

          </div>

          {/* Description */}

          <div className="form-group full-width">

            <label htmlFor="description">Description *</label>

            <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item..."
                className={errors.description ? "error" : ""}
            />

            {errors.description && (
                <span className="error-text">
            {errors.description}
          </span>
            )}

          </div>

          {/* Image Upload */}

          <div className="form-group full-width">

            <label htmlFor="image">

              Upload Image (Optional)

            </label>

            <input
                type="file"
                id="image"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handleImageChange}
            />

            {errors.image && (
                <span className="error-text">
            {errors.image}
          </span>
            )}

            {preview && (

                <div
                    style={{
                      marginTop: "15px"
                    }}
                >

                  <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "220px",
                        height: "220px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "1px solid #ddd"
                      }}
                  />

                </div>

            )}

          </div>

          {/* Contact Information */}

          <div className="form-section-title full-width">

            Contact Information

          </div>

          <div className="form-group">
            <label>Name</label>
            <input
                type="text"
                value={formData.contactName}
                readOnly
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
                type="email"
                value={formData.contactEmail}
                readOnly
            />
          </div>
        </div>

        <div className="form-actions">

          <button
              type="button"
              onClick={navigateToList}
              className="btn-cancel"
          >
            Cancel
          </button>

          <button
              type="submit"
              className="btn-submit"
          >
            Publish Post
          </button>

        </div>

      </form>
  );
}