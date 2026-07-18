import { useNavigation } from "../../context/NavigationContext";
import "./ProfileCard.css";

export default function ProfileCard({ profile }) {
    const { setSubView } = useNavigation();

    if (!profile) return null;

    const skills = Array.isArray(profile.skills)
        ? profile.skills
        : (profile.skills || "")
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0);

    return (
        <div className="section-card profile-card-comp">

            {/* Profile Avatar & Primary Info */}
            <div className="profile-card-top">
                <img
                    src={
                        profile.profileImage && profile.profileImage.trim() !== ""
                            ? profile.profileImage
                            : "https://img.magnific.com/free-photo/young-handsome-man-wearing-casual-tshirt-blue-background-happy-face-smiling-with-crossed-arms-looking-camera-positive-person_839833-12963.jpg?semt=ais_hybrid&w=740&q=80"
                    }
                    alt={profile.fullName}
                    className="profile-card-avatar"
                    onError={(e) => {
                        e.target.src =
                            "https://img.magnific.com/free-photo/young-handsome-man-wearing-casual-tshirt-blue-background-happy-face-smiling-with-crossed-arms-looking-camera-positive-person_839833-12963.jpg?semt=ais_hybrid&w=740&q=80";
                    }}
                />

                <h2 className="profile-card-name">
                    {profile.fullName}
                </h2>

                <p className="profile-card-title">
                    {profile.yearOfStudy
                        ? `Year ${profile.yearOfStudy}`
                        : "Year Not Available"}
                </p>

                <p className="profile-card-institution">
                    {profile.degreeProgram || "Degree Program"}
                </p>
            </div>

            {/* Biography */}
            <div className="profile-card-bio">
                <p className="bio-text">
                    "{profile.bio || "No biography available."}"
                </p>
            </div>

            {/* Buttons */}
            <div className="profile-card-actions">

                <button
                    onClick={() => setSubView("edit")}
                    className="btn-edit-profile"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>

                    Edit Profile
                </button>

                <button
                    onClick={() => setSubView("posts")}
                    className="btn-contributions"
                >
                    My Contributions
                </button>

            </div>

            {/* Skills */}
            <div className="profile-card-skills">

                <h4 className="skills-heading">
                    Tech & Skills
                </h4>

                <div className="skills-pills">

                    {skills.length > 0 ? (
                        skills.map((skill) => (
                            <span
                                key={skill}
                                className="skill-badge-pill"
                            >
                {skill}
              </span>
                        ))
                    ) : (
                        <span className="skill-badge-pill">
              No Skills Added
            </span>
                    )}

                </div>

            </div>

        </div>
    );
}