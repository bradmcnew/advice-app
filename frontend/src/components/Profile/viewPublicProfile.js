// src/components/Profile/ViewPublicProfile.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPublicProfile } from "../../features/profile/profileSlice";
import "../../styles/Profile.css";
import {
  formatTime,
  groupAvailabilityByDay,
} from "../../utils/availabilityUtils";

/**
 * ViewPublicProfile Component
 * Displays a user's public profile information
 * Fetches profile data based on URL parameter ID
 */
const ViewPublicProfile = () => {
  // Get user ID from URL parameters
  const { id } = useParams();
  console.log("id", id); // Debug log for ID

  // Initialize Redux dispatch
  const dispatch = useDispatch();

  // Select profile data, loading state, and error state from Redux store
  const { publicProfile, loading, error } = useSelector(
    (state) => state.profile
  );
  const { availability } = useSelector((state) => state.availability);

  // Fetch profile data when component mounts or when ID changes
  useEffect(() => {
    console.log("dispatching fetchPublicProfile"); // Debug log for fetch action
    dispatch(fetchPublicProfile(id));
  }, [dispatch, id]); // Dependencies ensure effect runs only when necessary

  console.log("publicProfile", publicProfile); // Debug log for profile data

  // Show loading state while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if fetch fails
  if (error) {
    return <div>Error: {error.messsage}</div>;
  }

  // Show message if no profile data is found
  if (!publicProfile) {
    return <div>No profile found</div>;
  }

  // Render profile information
  return (
    <div className="profile">
      {/* Display user's full name */}
      <h2>
        {publicProfile.profile.first_name} {publicProfile.profile.last_name}'s
        Profile
      </h2>
      {/* Basic profile information */}
      <p>Bio: {publicProfile.profile.bio}</p>
      <p>Location: {publicProfile.profile.location}</p>
      {/* Profile picture with alt text for accessibility */}
      <p>
        Profile Picture:{" "}
        <img
          src={`${process.env.REACT_APP_SERVER_URL}${publicProfile.profile.profile_picture}`}
          alt="Profile"
        />
      </p>
      {/* Skills Section */}
      {Array.isArray(publicProfile.profile.skills) &&
        publicProfile.profile.skills?.length > 0 && (
          <div className="profile-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {publicProfile.profile.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      {/* Availability Section */}
      {availability.length > 0 && (
        <div className="profile-section">
          <h3>Availability</h3>
          <div className="availability-list">
            {Object.entries(groupAvailabilityByDay(availability)).map(
              ([day, sessions]) => (
                <div key={day} className="availability-day">
                  <div className="day">
                    {day.charAt(0).toUpperCase() + day.slice(1)}s
                  </div>
                  <div className="sessions">
                    {sessions.map((session, index) => (
                      <span key={index} className="session-time">
                        {formatTime(session.start)} - {formatTime(session.end)}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Social media links section */}
      <div className="social-links">
        Social Media Links: {/* Only render social media links if they exist */}
        {publicProfile.profile.social_media_links &&
          Object.entries(publicProfile.profile.social_media_links).map(
            ([platform, url]) => (
              // Use platform as unique key for React list rendering
              <div key={platform}>
                {/* Open links in new tab with security attributes */}
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {platform}
                </a>
              </div>
            )
          )}
      </div>
    </div>
  );
};

// Export component for use in other parts of the application
export default ViewPublicProfile;
