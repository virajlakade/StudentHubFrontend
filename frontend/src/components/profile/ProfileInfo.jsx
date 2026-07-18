import "./ProfileInfo.css";

export default function ProfileInfo({ profile }) {
  if (!profile) return null;

  return (
      <div className="section-card profile-info-comp">
        <h3 className="profile-info-heading">
          Institutional Details
        </h3>

        <div className="info-fields-grid">

          {/* Roll Number */}
          <div className="info-field-row">
            <div className="info-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>

            <div className="info-field-details">
            <span className="field-label">
              Student Roll Number
            </span>

              <span className="field-value">
              {profile.rollNumber || "Not provided"}
            </span>
            </div>
          </div>

          {/* Email */}
          <div className="info-field-row">
            <div className="info-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22 6 12 13 2 6"/>
              </svg>
            </div>

            <div className="info-field-details">
            <span className="field-label">
              Institutional Email
            </span>

              <span className="field-value">
              {profile.email}
            </span>
            </div>
          </div>

          {/* Branch */}
          <div className="info-field-row">
            <div className="info-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10v6"/>
                <path d="M6 12h12M6 8h12M6 16h12"/>
              </svg>
            </div>

            <div className="info-field-details">
            <span className="field-label">
              Department
            </span>

              <span className="field-value">
              {profile.branch || "Not provided"}
            </span>
            </div>
          </div>

          {/* Degree Program */}
          <div className="info-field-row">
            <div className="info-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10v6"/>
                <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
              </svg>
            </div>

            <div className="info-field-details">
            <span className="field-label">
              Degree Program
            </span>

              <span className="field-value">
              {profile.degreeProgram || "Not provided"}
            </span>
            </div>
          </div>

          {/* Year */}
          <div className="info-field-row">
            <div className="info-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>

            <div className="info-field-details">
            <span className="field-label">
              Year of Study
            </span>

              <span className="field-value">
              {profile.yearOfStudy
                  ? `Year ${profile.yearOfStudy}`
                  : "Not provided"}
            </span>
            </div>
          </div>

          {/* Phone */}
          <div className="info-field-row">
            <div className="info-field-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>

            <div className="info-field-details">
            <span className="field-label">
              Contact Number
            </span>

              <span className="field-value">
              {profile.phone || "Not provided"}
            </span>
            </div>
          </div>

        </div>
      </div>
  );
}