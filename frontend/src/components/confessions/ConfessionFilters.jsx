import { useEffect, useState } from "react";
import axios from "axios";
import "./ConfessionFilters.css";

export default function ConfessionFilters({
                                              selectedCategory,
                                              setSelectedCategory,
                                              sortBy,
                                              setSortBy,
                                          }) {

    const [categories, setCategories] = useState(["All"]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {

            const response = await axios.get(
                "http://localhost:8090/api/confessions/categories"
            );

            setCategories([
                "All",
                ...response.data
            ]);

        } catch (error) {
            console.error(
                "Failed to load categories",
                error
            );
        }
    };

    return (
        <div className="conf-filters-box">

            {/* Category Buttons */}
            <div className="conf-pills-list">

                {categories.map((cat) => {

                    const isActive =
                        selectedCategory === cat;

                    return (
                        <button
                            key={cat}
                            onClick={() =>
                                setSelectedCategory(cat)
                            }
                            className={`conf-pill-btn ${
                                isActive ? "active" : ""
                            }`}
                        >
                            {cat}
                        </button>
                    );
                })}

            </div>

            {/* Sorting Dropdown */}
            <div className="conf-sort-wrapper">

        <span className="conf-sort-label">
          Sort:
        </span>

                <select
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value)
                    }
                    className="conf-sort-select"
                >
                    <option value="recent">
                        Recent
                    </option>

                    <option value="popular">
                        Most Liked
                    </option>

                </select>

            </div>

        </div>
    );
}