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
import AvailabilityForm from "./AvailabilityForm";
import { setAvailability } from "../../features/availability/availabilitySlice";
import ProfilePictureUpload from "./ProfilePictureUpload";
import SocialMediaLinks from "./SocialMediaLinks";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Destructure profile state and availability state from Redux store
  const { profile, loading, error, uploadLoading } = useSelector(
    (state) => state.profile
  );
  const { availability } = useSelector((state) => state.availability);

  // State for handling selected files
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  // Form state initialization, including nested objects
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
  });

  // State for availability data, updated when AvailabilityForm changes
  const [availabilityData, setAvailabilityData] = useState([]);

  // Handler for availability form changes
  const handleAvailabilityChange = (newAvailability) => {
    setAvailabilityData(newAvailability);
  };

  // Fetch the profile data on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Populate form data when profile is loaded
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
      });
    }
  }, [profile]);

  // Handle input change for main form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle change for social media link inputs specifically
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      social_media_links: { ...formData.social_media_links, [name]: value },
    });
  };

  // Validate and set resume file selection
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

  // Submit handler to dispatch actions for uploading files and updating profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle file uploads before profile data to ensure consistency
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

      // Update profile with current form data, parsing skills into an array
      const updatedFormData = {
        ...formData,
        social_media_links: { ...formData.social_media_links },
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      };
      await dispatch(editProfile(updatedFormData)).unwrap();

      // Update availability if there are slots selected
      if (availabilityData.length > 0) {
        await dispatch(setAvailability(availabilityData)).unwrap();
      }

      // Refresh profile data and navigate to the profile page
      await dispatch(fetchProfile());
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update profile");
    }
  };

  // Display loading or error messages
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Error: {error.message || JSON.stringify(error)}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Profile picture section */}
      <ProfilePictureUpload
        currentProfilePic={`${process.env.REACT_APP_SERVER_URL}${profile?.profile_picture}`}
        onUpload={(file) => setSelectedProfilePic(file)}
        existingPicture={profile?.profile_picture}
      />

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
      <SocialMediaLinks
        links={formData.social_media_links}
        onChange={handleSocialMediaChange}
      />

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

            {/* Updated AvailabilityForm with onChange handler */}
            <AvailabilityForm
              existingAvailability={availability}
              onChange={handleAvailabilityChange}
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
      <button type="submit" disabled={uploadLoading}>
        {uploadLoading ? "Uploading..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditProfile;
