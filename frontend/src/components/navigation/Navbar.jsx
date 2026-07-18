import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { profileService } from "../../services/profileService";
import "./Navbar.css";

function Navbar() {
  const { searchQuery, setSearchQuery, setActiveTab } = useNavigation();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();

    window.addEventListener("profile-updated", loadProfile);

    return () => {
      window.removeEventListener("profile-updated", loadProfile);
    };
  }, []);

  const defaultAvatar =
      "https://img.magnific.com/free-photo/young-handsome-man-wearing-casual-tshirt-blue-background-happy-face-smiling-with-crossed-arms-looking-camera-positive-person_839833-12963.jpg?semt=ais_hybrid&w=740&q=80";

  return (
      <header className="navbar-header">

        {/* Search */}
        <div className="navbar-search-container">
        <span className="navbar-search-icon">
          <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

          <input
              type="text"
              placeholder="Search items..."
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-search-input"
          />
        </div>

        {/* Right Side */}
        <div className="navbar-controls">

          {/* Notification */}
          <button className="navbar-icon-btn">
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="navbar-badge"></span>
          </button>

          {/* Help */}
          <button className="navbar-icon-btn">
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>

          <div className="navbar-divider"></div>

          {/* Profile */}
          <div
              className="navbar-profile"
              onClick={() => setActiveTab("Profile")}
          >
            <div className="navbar-profile-info">
              <div className="navbar-profile-name">
                {profile?.fullName || "Student"}
              </div>
            </div>

            <img
                src={
                  profile?.profileImage &&
                  profile.profileImage.trim() !== ""
                      ? profile.profileImage
                      : defaultAvatar
                }
                alt="Profile Avatar"
                className="navbar-profile-avatar"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
            />
          </div>

        </div>
      </header>
  );
}

export default Navbar;