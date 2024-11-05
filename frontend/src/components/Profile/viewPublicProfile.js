// src/components/Profile/ViewPublicProfile.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPublicProfile } from "../../features/profile/profileSlice";

const ViewPublicProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchPublicProfile(id));
  }, [dispatch, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile">
      <h2>
        {profile.first_name} {profile.last_name}'s Profile
      </h2>
      <p>Bio: {profile.bio}</p>
      <p>Location: {profile.location}</p>
      <p>
        Profile Picture: <img src={profile.profile_picture} alt="Profile" />
      </p>
      <p>Social Media Links: {profile.social_media_links}</p>
    </div>
  );
};

export default ViewPublicProfile;
