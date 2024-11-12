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
import axiosInstance from "../../axios/axiosConfig";
import Select from "react-select";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Destructure profile state and availability state from Redux store
  const { profile, loading, error, uploadLoading } = useSelector(
    (state) => state.profile
  );
  const { availability } = useSelector((state) => state.availability);

  // State for handling selected files (profile picture and resume)
  const [selectedProfilePic, setSelectedProfilePic] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  // Initial form data state with nested social media links
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
    skills: [], // Array for selected skills
  });

  // State for availability data, updated when AvailabilityForm changes
  const [availabilityData, setAvailabilityData] = useState([]);

  // Handler to update availability data when AvailabilityForm changes
  const handleAvailabilityChange = (newAvailability) => {
    setAvailabilityData(newAvailability);
  };

  // State for handling skills selection
  const [skillsOptions, setSkillsOptions] = useState([]);

  // Fetch available skills for the user to select
  useEffect(() => {
    const fetchSkills = async () => {
      const response = await axiosInstance.get("/profile/skills");
      const formattedSkills = response.data.skillNames.map((skill) => ({
        value: skill,
        label: skill,
      }));
      setSkillsOptions(formattedSkills);
    };
    fetchSkills();
  }, []);

  // Fetch profile data on component mount (e.g., when editing profile)
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Populate form data with existing profile data when it's loaded
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
        skills: Array.isArray(profile.skills)
          ? profile.skills.map((skill) => ({
              value: typeof skill === "object" ? skill.name : skill,
              label: typeof skill === "object" ? skill.name : skill,
            }))
          : [],
      });
    }
  }, [profile]);

  // Handle input changes for the main form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle skills selection change in the 'Select' component
  const handleSkillsChange = (selectedSkills) => {
    setFormData({ ...formData, skills: selectedSkills });
  };

  // Handle changes in social media links (individual inputs)
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      social_media_links: { ...formData.social_media_links, [name]: value },
    });
  };

  // Validate and handle resume file selection (only PDF and under 5MB)
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

  // Handle form submission, including file uploads and profile updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle file uploads first (profile picture, resume) to ensure consistency
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

      // Update profile with the form data, ensuring skills are in the correct format
      const updatedFormData = {
        ...formData,
        social_media_links: { ...formData.social_media_links },
        skills: formData.skills.map((skill) => skill.value),
      };
      await dispatch(editProfile(updatedFormData)).unwrap();

      // If availability slots are selected, update availability
      if (availabilityData.length > 0) {
        await dispatch(setAvailability(availabilityData)).unwrap();
      }

      // Refresh profile data after successful update and navigate to the profile page
      await dispatch(fetchProfile());
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update profile");
    }
  };

  // Display loading or error messages while waiting for data or handling errors
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

      {/* Basic Info section */}
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

      {/* College Student Specific Info */}
      {profile?.role === "college_student" && (
        <>
          <div className="form-section">
            <h3>College Student Information</h3>
            <Select
              isMulti
              value={formData.skills}
              options={skillsOptions}
              onChange={handleSkillsChange}
              placeholder="Select Skills"
            />

            {/* Availability Form */}
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
