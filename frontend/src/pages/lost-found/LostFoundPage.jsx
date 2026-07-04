import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { lostFoundService } from "../../services/lostFoundService";
import LostFoundFilters from "../../components/lost-found/LostFoundFilters";
import LostFoundList from "../../components/lost-found/LostFoundList";
import "./LostFoundPage.css";

export default function LostFoundPage() {

  const { navigateToCreate, searchQuery } = useNavigation();

  const [items, setItems] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch items from backend
  useEffect(() => {

    const fetchItems = async () => {

      try {

        const data = await lostFoundService.getItems();
        console.log(data);
        setItems(data);

      } catch (error) {

        console.error("Error fetching Lost & Found items", error);

      } finally {

        setLoading(false);

      }

    };

    fetchItems();

  }, []);

  // Apply filters
  const filteredItems = items.filter((item) => {

    const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
        selectedStatus === "All" ||
        item.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

    return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
    );

  });

  if (loading) {
    return (
        <div className="lost-found-page">
          <h2 style={{ textAlign: "center", marginTop: "100px" }}>
            Loading...
          </h2>
        </div>
    );
  }

  return (
      <div className="lost-found-page">

        {/* Header */}

        <div className="lost-found-header">

          <div className="header-text-container">

            <h1 className="page-title">
              Lost & Found
            </h1>

            <p className="page-subtitle">
              Manage and discover lost and found items across campus.
            </p>

          </div>

          <button
              onClick={navigateToCreate}
              className="btn-add-item"
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
                className="plus-icon"
            >
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>

            Add New Item

          </button>

        </div>

        {/* Filters */}

        <div className="lost-found-filters-bar">

          <LostFoundFilters
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
          />

        </div>

        {/* List */}

        <div className="lost-found-content">

          <LostFoundList
              items={filteredItems}
          />

        </div>

      </div>
  );
}