import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editProfile,
  fetchProfile,
  uploadProfilePicture,
  uploadResume,
} from "../../features/profile/profileSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading, error, uploadLoading } = useSelector(
    (state) => state.profile
  );

  // state for files
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    phone_number: "",
    location: "",
    social_media_links: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
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
        social_media_links: profile.social_media_links || {
          linkedin: "",
          twitter: "",
          facebook: "",
          instagram: "",
        },
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

  const handleProfilePicSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedProfilePic(file);
    }
  };

  const handleResumeSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedResume(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle file uploads
      if (selectedProfilePic) {
        const picFormData = new FormData();
        picFormData.append("profile_picture", selectedProfilePic);
        await dispatch(uploadProfilePicture(picFormData)).unwrap();
      }

      if (selectedResume) {
        const resumeFormData = new FormData();
        resumeFormData.append("resume", selectedResume);
        await dispatch(uploadResume(resumeFormData)).unwrap();
      }

      const updatedFormData = {
        ...formData,
        social_media_links: { ...formData.social_media_links },
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      };
      await dispatch(editProfile(updatedFormData)).unwrap();

      await dispatch(fetchProfile());
      navigate("/profile");
    } catch (error) {
      alert(error.message || "Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message || JSON.stringify(error)}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Profile picture section */}
      <div className="upload-section">
        <h3>Profile Picture</h3>
        {profile?.profile_picture && (
          <img
            src={`${process.env.REACT_APP_SERVER_URL}${profile.profile_picture}`}
            alt="Current profile"
            className="current-profile-pic"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicSelect}
          id="profile-pic-upload"
          className="file-input"
        />
        <label htmlFor="profile-pic-upload" className="file-input-label">
          {profile?.profile_picture
            ? "Change Profile Picture"
            : "Upload Profile Picture"}{" "}
        </label>
        {selectedProfilePic && (
          <span className="selected-file">
            Selected: {selectedProfilePic.name}
          </span>
        )}
      </div>

      {/* Basic Info */}
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

      {/* College Student Section */}
      {profile?.role === "college_student" && (
        <>
          <div className="form-section">
            <h3>College Student Information</h3>
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
          </div>

          {/* Resume Upload */}
          <div className="upload-section">
            <h3>Resume</h3>
            {profile?.resume && (
              <a
                href={`${process.env.REACT_APP_SERVER_URL}${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="current-resume-link"
              >
                View Current Resume
              </a>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeSelect}
              id="resume-upload"
              className="file-input"
            />
            <label htmlFor="resume-upload" className="file-input-label">
              {profile?.resume ? "Change Resume" : "Upload Resume"} (PDF only)
            </label>
            {selectedResume && (
              <span className="selected-file">
                Selected: {selectedResume.name}
              </span>
            )}
          </div>
        </>
      )}
      <button type="submit">Save</button>
    </form>
  );
};

export default EditProfile;
