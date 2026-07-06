import React, { useState } from "react";
import ExperienceCard from "./ExperienceCard";
import "./ExperienceFeed.css";

export function ExperienceFeed({ experiences, onLike, onDelete }) {

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Unique companies
  const companies = [...new Set(experiences.map((exp) => exp.companyName))];

  // Apply filters
  const filteredExperiences = experiences.filter((exp) => {

    const matchesSearch =
        searchTerm === "" ||
        exp.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.experienceText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.tips?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCompany =
        selectedCompany === "all" ||
        exp.companyName === selectedCompany;

    const matchesType =
        selectedType === "all" ||
        exp.type?.toLowerCase() ===
        selectedType.toLowerCase().replace("-", "_");

    const matchesDifficulty =
        selectedDifficulty === "all" ||
        exp.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

    return (
        matchesSearch &&
        matchesCompany &&
        matchesType &&
        matchesDifficulty
    );
  });

  return (
      <div className="experience-feed-wrapper">

        {/* Search & Filters */}

        <div className="feed-filters-container">

          <div className="search-bar-wrapper">

            <svg
                className="filter-search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
                type="text"
                placeholder="Search by company, role, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-search-input"
            />

          </div>

          <div className="feed-dropdowns-group">

            {/* Company */}

            <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="filter-select"
            >

              <option value="all">All Companies</option>

              {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
              ))}

            </select>

            {/* Type */}

            <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
            >

              <option value="all">All Types</option>
              <option value="internship">Internship</option>
              <option value="full_time">Full Time</option>
              <option value="ppo">PPO</option>

            </select>

            {/* Difficulty */}

            <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="filter-select"
            >

              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>

            </select>

          </div>

        </div>

        {/* Feed */}

        {filteredExperiences.length === 0 ? (

            <div className="feed-empty-state glass-card">

              <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>

              <h3>No experiences found</h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>

        ) : (

            <div className="feed-cards-grid">

              {filteredExperiences.map((exp) => (
                  <ExperienceCard
                      key={exp.id}
                      experience={exp}
                      onLike={onLike}
                      onDelete={onDelete}
                  />
              ))}

            </div>

        )}

      </div>
  );
}

export default ExperienceFeed;