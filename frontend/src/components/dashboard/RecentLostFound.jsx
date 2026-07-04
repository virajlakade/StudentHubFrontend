import { useNavigation } from "../../context/NavigationContext";
import { lostFoundService } from "../../services/lostFoundService";
import { useEffect, useState } from "react";

export default function RecentLostFound() {
  const { setActiveTab, navigateToDetails } = useNavigation();
  const [recentItems, setRecentItems] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const data = await lostFoundService.getItems();
                setItems(data.slice(0, 4));
            } catch (err) {
                console.error(err);
            }
        };

        loadItems();
    }, []);

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">Recent Lost & Found</h2>
        <button
          onClick={() => setActiveTab("Lost & Found")}
          className="section-link"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          View All
        </button>
      </div>

      <div className="list-container">
        {recentItems.map((item) => (
          <div
            key={item.id}
            className="list-item"
            onClick={() => {
              setActiveTab("Lost & Found");
              navigateToDetails(item.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <div className="item-left">
              <div className="item-icon">
                {item.status === "lost" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ef4444" }}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#10b981" }}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                )}
              </div>
              <div className="item-details">
                <h4 className="item-title">{item.title}</h4>
                <p className="item-subtitle">
                  {item.status.toUpperCase()} • {item.time} • {item.location}
                </p>
              </div>
            </div>
            <button
              className="item-btn"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("Lost & Found");
                navigateToDetails(item.id);
              }}
            >
              View
            </button>
          </div>
        ))}
        {recentItems.length === 0 && (
          <p style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center", margin: "20px 0" }}>
            No recent items posted.
          </p>
        )}
      </div>
    </div>
  );
}
