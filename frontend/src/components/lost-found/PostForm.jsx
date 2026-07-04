import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { lostFoundService } from "../../services/lostFoundService";
import "./PostForm.css";

const CATEGORIES = ["Electronics", "Documents", "Books", "Keys", "Personal","Other"];

export default function PostForm() {
  const { navigateToList } = useNavigation();
  const [formData, setFormData] = useState({
    title: "",
    status: "lost",
    category: "Electronics",
    location: "",
    description: "",
    image: "",
    contactName: "", // Default mockup user name
    contactEmail: ""
  });

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

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.image && !formData.image.startsWith("http")) {
      newErrors.image = "Please enter a valid image URL starting with http/https";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    let finalImage = formData.image.trim();

    if (!finalImage) {

      if (formData.status === "lost") {

        finalImage =
            "https://images.unsplash.com/photo-1501250961760-a7b3c296a64f?q=80&w=600&auto=format&fit=crop";

      } else {

        finalImage =
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop";

      }

    }

    try {

      await lostFoundService.addItem({
        ...formData,
        status: formData.status.toUpperCase(),
        image: finalImage
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
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status">Status *</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
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
            placeholder="e.g. Canteen, Central Hub or Library, 3rd Floor"
            className={errors.location ? "error" : ""}
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the item (color, brand, serial number, contents) and where you lost/found it..."
            rows="4"
            className={errors.description ? "error" : ""}
          ></textarea>
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        {/* Image URL */}
        <div className="form-group full-width">
          <label htmlFor="image">Image URL (Optional)</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="e.g. https://images.unsplash.com/..."
            className={errors.image ? "error" : ""}
          />
          {errors.image && <span className="error-text">{errors.image}</span>}
        </div>

        {/* Contact Info Heading */}
        <div className="form-section-title full-width">Contact Information</div>

        {/* Contact Name */}
        <div className="form-group">
          <label htmlFor="contactName">Name</label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
          />
        </div>

        {/* Contact Email */}
        <div className="form-group">
          <label htmlFor="contactEmail">Email</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="form-actions">
        <button type="button" onClick={navigateToList} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit">
          Publish Post
        </button>
      </div>
    </form>
  );
}
