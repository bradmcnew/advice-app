import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../features/profile/profileSlice";
import "../../styles/Profile.css";

const ViewOwnProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  if (!profile) {
    return <div>No profile found</div>;
  }

  console.log("prof pic: ", profile.profile_picture);

  return (
    <div className="profile">
      <h2>{profile?.username}'s Profile</h2>
      <p>Email: {profile?.email}</p>
      <p>First Name: {profile?.first_name}</p>
      <p>Last Name: {profile?.last_name}</p>
      <p>Bio: {profile?.bio}</p>
      <p>Phone Number: {profile?.phone_number}</p>
      <p>Location: {profile?.location}</p>
      <p>
        Profile Picture:{" "}
        {profile?.profile_picture ? (
          <img
            src={`${process.env.REACT_APP_SERVER_URL}${profile.profile_picture}`}
            alt="Profile"
          />
        ) : (
          "No profile picture available"
        )}
      </p>

      {/* Render social media links if they exist */}
      <div className="social-links">
        <h3>Social Media Links:</h3>
        {profile?.social_media_links &&
        typeof profile?.social_media_links === "object" ? (
          <ul>
            {Object.entries(profile?.social_media_links).map(
              ([platform, url]) => (
                <li key={platform}>
                  {platform}:{" "}
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No social media links available</p>
        )}
      </div>

      {profile?.role === "college_student" && (
        <div className="college-student-section">
          {profile.resume && (
            <div className="current-resume">
              <h3>Current Resume</h3>
              <a
                href={`${process.env.REACT_APP_SERVER_URL}${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-link"
              >
                View Current Resume
              </a>
            </div>
          )}

          {/* Render skills if they exist */}
          <div>
            <h3>Skills:</h3>
            {Array.isArray(profile?.skills) && profile.skills.length > 0 ? (
              <ul>
                {console.log("skills", profile.skills)}
                {profile.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No skills available</p>
            )}
          </div>

          <p className="availability">
            Availability: {profile?.availability || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewOwnProfile;
