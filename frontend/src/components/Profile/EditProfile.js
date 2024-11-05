import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile, fetchProfile } from "../../features/profile/profileSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    phone_number: "",
    location: "",
    profile_picture: "",
    social_media_links: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
    resume: "",
    skills: "",
    availability: "",
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        bio: profile.bio || "",
        phone_number: profile.phone_number || "",
        location: profile.location || "",
        profile_picture: profile.profile_picture || "",
        social_media_links: profile.social_media_links || {
          linkedin: "",
          twitter: "",
          facebook: "",
          instagram: "",
        },
        resume: profile.resume || "",
        skills: profile.skills ? profile.skills.join(", ") : "",
        availability: profile.availability || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      social_media_links: { ...formData.social_media_links, [name]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      social_media_links: { ...formData.social_media_links },
      skills: formData.skills.split(",").map((skill) => skill.trim()),
    };
    dispatch(editProfile(updatedFormData));
    dispatch(fetchProfile());
    navigate("/profile");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message || JSON.stringify(error)}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Bio"
      />
      <input
        type="text"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
      />

      {/* Social Media Links */}
      <div>
        <h3>Social Media Links</h3>
        <input
          type="text"
          name="linkedin"
          value={formData.social_media_links.linkedin}
          onChange={handleSocialMediaChange}
          placeholder="LinkedIn URL"
        />
        <input
          type="text"
          name="twitter"
          value={formData.social_media_links.twitter}
          onChange={handleSocialMediaChange}
          placeholder="Twitter URL"
        />
        <input
          type="text"
          name="facebook"
          value={formData.social_media_links.facebook}
          onChange={handleSocialMediaChange}
          placeholder="Facebook URL"
        />
        <input
          type="text"
          name="instagram"
          value={formData.social_media_links.instagram}
          onChange={handleSocialMediaChange}
          placeholder="Instagram URL"
        />
      </div>

      {/* Skills */}
      <input
        type="text"
        name="skills"
        value={formData.skills}
        onChange={handleChange}
        placeholder="Skills (comma-separated)"
      />

      <input
        type="text"
        name="availability"
        value={formData.availability}
        onChange={handleChange}
        placeholder="Availability"
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default EditProfile;
