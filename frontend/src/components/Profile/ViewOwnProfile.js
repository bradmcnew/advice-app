import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../features/profile/profileSlice";
import "../../styles/Profile.css";
import {
  formatTime,
  groupAvailabilityByDay,
} from "../../utils/availabilityUtils";

const ViewOwnProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => {
    console.log("Full Redux state:", state);
    return state.profile;
  });
  const { availability } = useSelector((state) => state.availability);

  console.log("Current profile:", profile);

  useEffect(() => {
    console.log("Dispatching fetchProfile");
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
                {profile.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p>No skills available</p>
            )}
          </div>

          {/* Availability Section */}
          <div className="availability-section">
            <h3>Availability</h3>
            {availability.length > 0 ? (
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
                            {formatTime(session.start)} -{" "}
                            {formatTime(session.end)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p>No availability set</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOwnProfile;
