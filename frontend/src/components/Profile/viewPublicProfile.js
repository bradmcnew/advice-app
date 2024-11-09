// src/components/Profile/ViewPublicProfile.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPublicProfile } from "../../features/profile/profileSlice";
import "../../styles/Profile.css";

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
