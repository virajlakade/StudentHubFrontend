import { useEffect, useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { confessionService } from "../../services/confessionService";
import "./TrendingConfessions.css";

export default function TrendingConfessions() {

    const { setActiveTab, navigateToDetails } = useNavigation();

    const [trending, setTrending] = useState([]);

    useEffect(() => {
        loadTrending();
    }, []);

    const loadTrending = async () => {
        try {
            const response = await confessionService.getConfessions();

            const data = Array.isArray(response) ? response : [];

            const sorted = data
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .slice(0, 2);

            setTrending(sorted);

        } catch (err) {
            console.error("Error loading trending confessions", err);
            setTrending([]);
        }
    };

    return (
        <div className="section-card trending-confessions-card">

            <div className="section-header">

                <h2 className="section-title">
                    Trending Confessions
                </h2>

                <button
                    className="section-link"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                    }}
                    onClick={() => setActiveTab("Anonymous Confessions")}
                >
                    View All
                </button>

            </div>

            <div className="list-container">

                {trending.length > 0 ? (

                    trending.map((item) => (

                        <div
                            key={item.id}
                            className="list-item confession-trend-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setActiveTab("Anonymous Confessions");
                                navigateToDetails(item.id);
                            }}
                        >

                            <div className="trend-details">

                                <p className="trend-text">
                                    "{item.message}"
                                </p>

                                <div className="trend-meta">

                                    <span className="trend-category">
                                        {item.category}
                                    </span>

                                    <span className="trend-stat">
                                        ❤️ {item.likes ?? 0}
                                    </span>

                                    <span className="trend-stat">
                                        💬 {item.commentCount ?? item.comments?.length ?? 0}
                                    </span>

                                </div>

                            </div>

                        </div>

                    ))

                ) : (

                    <p className="no-trends-prompt">
                        No trending confessions.
                    </p>

                )}

            </div>

        </div>
    );
}