import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../features/profile/profileSlice";

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

  console.log("profile", profile);
  console.log("skills", profile?.skills);

  // profile?.skills?.map((skill) => {
  //   console.log("skill", skill.name);
  // });

  // console.log("user auth", profile?.User);
  console.log("role", profile?.User?.role);

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
          <img src={profile.profile_picture} alt="Profile" />
        ) : (
          "No profile picture available"
        )}
      </p>

      {/* Render social media links if they exist */}
      <div>
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
        <>
          <div>
            <h3>Resume:</h3>
            <p>{profile?.User?.resume}</p>
          </div>

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

          <p>Availability: {profile?.availability || "N/A"}</p>
        </>
      )}

      {/* Display any message */}
      <p>{profile?.message || "No message"}</p>
    </div>
  );
};

export default ViewOwnProfile;
