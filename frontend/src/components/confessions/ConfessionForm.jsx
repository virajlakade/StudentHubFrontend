import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation } from "../../context/NavigationContext";
import "./ConfessionForm.css";

const MAX_CHARACTERS = 500;

export default function ConfessionForm({ onAdd }) {
  const { navigateToList } = useNavigation();

  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get(
          "http://localhost:8090/api/confessions/categories"
      );

      setCategories(response.data);

      if (response.data.length > 0) {
        setCategory(response.data[0]);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;

    if (value.length <= MAX_CHARACTERS) {
      setText(value);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Confession text cannot be empty!");
      return;
    }

    if (text.trim().length < 10) {
      setError(
          "Please write a confession of at least 10 characters."
      );
      return;
    }

    onAdd(text, category);
    navigateToList();
  };

  const charsRemaining =
      MAX_CHARACTERS - text.length;

  return (
      <form
          onSubmit={handleSubmit}
          className="conf-form-comp"
      >
        <div className="conf-form-header">

          <h2 className="conf-form-title">
            Write Confession Anonymously 🤐
          </h2>

          <p className="conf-form-subtitle">
            Your identity will never be tracked
            or displayed. Express yourself freely.
          </p>

        </div>

        <div className="conf-form-body">

          {/* Category Dropdown */}
          <div className="conf-form-group">

            <label htmlFor="conf-category">
              Choose Category
            </label>

            <select
                id="conf-category"
                value={category}
                onChange={(e) =>
                    setCategory(e.target.value)
                }
                className="conf-select-input"
            >
              {categories.map((cat) => (
                  <option
                      key={cat}
                      value={cat}
                  >
                    {cat}
                  </option>
              ))}
            </select>

          </div>

          {/* Text Area */}
          <div className="conf-form-group">

            <div className="conf-label-row">

              <label htmlFor="conf-text">
                Confession Content *
              </label>

              <span
                  className={`conf-char-counter ${
                      charsRemaining < 50
                          ? "warning"
                          : ""
                  }`}
              >
              {charsRemaining} characters left
            </span>

            </div>

            <textarea
                id="conf-text"
                value={text}
                onChange={handleTextChange}
                placeholder="Type your secret or thoughts here..."
                rows="6"
                className={`conf-textarea-input ${
                    error ? "error" : ""
                }`}
            />

            {error && (
                <span className="conf-error-text">
              {error}
            </span>
            )}

          </div>

        </div>

        {/* Buttons */}
        <div className="conf-form-actions">

          <button
              type="button"
              onClick={navigateToList}
              className="conf-btn-cancel"
          >
            Cancel
          </button>

          <button
              type="submit"
              className="conf-btn-submit"
          >
            Post Anonymously
          </button>

        </div>

      </form>
  );
}