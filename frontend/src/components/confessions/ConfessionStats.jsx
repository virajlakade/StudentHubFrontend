import { DEFAULT_CATEGORY_STYLE } from "../../data/confessionCategories";
import "./ConfessionStats.css";

export default function ConfessionStats({ confessions = [] }) {

    const totalConfessions = confessions.length;

    const totalLikes = confessions.reduce(
        (acc, confession) => acc + (confession.likes || 0),
        0
    );

    // Count confessions by category
    const categoryCounts = confessions.reduce(
        (acc, confession) => {

            const category =
                confession.category || "Unknown";

            acc[category] =
                (acc[category] || 0) + 1;

            return acc;

        },
        {}
    );

    // Sort categories by number of posts
    const sortedCategories =
        Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1]);

    return (
        <div className="section-card conf-stats-card">

            {/* Header */}
            <h2 className="section-title">
                Confessions Hub
            </h2>

            <p className="stats-tagline">
                Campus stats anonymously updated.
            </p>

            {/* KPI Cards */}
            <div className="stats-kpis">

                <div className="stat-kpi">
          <span className="kpi-value">
            {totalConfessions}
          </span>

                    <span className="kpi-label">
            Total Posts
          </span>
                </div>

                <div className="stat-kpi">
          <span className="kpi-value">
            {totalLikes}
          </span>

                    <span className="kpi-label">
            Hearts Received
          </span>
                </div>

            </div>

            {/* Categories */}
            <div className="stats-popular-categories">

                <h4 className="stats-subtitle">
                    Active Spaces
                </h4>

                <div className="stats-categories-list">

                    {sortedCategories.length > 0 ? (

                        sortedCategories
                            .slice(0, 4)
                            .map(([cat, count]) => (

                                <div
                                    key={cat}
                                    className="stat-category-row"
                                >

                  <span
                      className="stat-category-dot"
                      style={{
                          backgroundColor:
                          DEFAULT_CATEGORY_STYLE.color
                      }}
                  />

                                    <span className="stat-category-name">
                    {cat}
                  </span>

                                    <span className="stat-category-count">
                    {count} posts
                  </span>

                                </div>

                            ))

                    ) : (

                        <p className="no-active-spaces">
                            No active spaces yet.
                        </p>

                    )}

                </div>

            </div>

        </div>
    );
}