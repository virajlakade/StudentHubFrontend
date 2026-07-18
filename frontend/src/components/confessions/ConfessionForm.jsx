import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigation } from "../../context/NavigationContext";
import "./ConfessionForm.css";

const API = "http://localhost:8090/api";
const MAX_CHARACTERS = 500;

export default function ConfessionForm({ onAdd }) {
  const { navigateToList } = useNavigation();

  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/confessions/categories`);

      console.log("Categories API Response:", response.data);

      if (Array.isArray(response.data)) {
        setCategories(response.data);

        if (response.data.length > 0) {
          setCategory(response.data[0]);
        }
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter your confession.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    onAdd(text.trim(), category);
    navigateToList();
  };

  return (
      <form className="conf-form-comp" onSubmit={handleSubmit}>
        <div className="conf-form-header">
          <h2 className="conf-form-title">
            Write Confession Anonymously 🤐
          </h2>

          <p className="conf-form-subtitle">
            Your identity will never be tracked or displayed.
          </p>
        </div>

        <div className="conf-form-body">
          <div className="conf-form-group">
            <label>Category</label>

            {loading ? (
                <p>Loading categories...</p>
            ) : (
                <select
                    className="conf-select-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.length === 0 ? (
                      <option value="">No Categories Found</option>
                  ) : (
                      categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                      ))
                  )}
                </select>
            )}
          </div>

          <div className="conf-form-group">
            <label>Confession</label>

            <textarea
                className="conf-textarea-input"
                rows={6}
                maxLength={MAX_CHARACTERS}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError("");
                }}
                placeholder="Write your confession..."
            />

            <small>
              {text.length}/{MAX_CHARACTERS}
            </small>
          </div>

          {error && (
              <div className="conf-error-text">
                {error}
              </div>
          )}
        </div>

        <div className="conf-form-actions">
          <button
              type="button"
              className="conf-btn-cancel"
              onClick={navigateToList}
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