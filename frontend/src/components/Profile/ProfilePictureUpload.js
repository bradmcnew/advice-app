// ProfilePictureUpload.js
import React, { useState } from "react";

const ProfilePictureUpload = ({
  currentProfilePic,
  onUpload,
  existingPicture,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type.startsWith("image/") &&
      file.size <= 5 * 1024 * 1024
    ) {
      setSelectedFile(file);
      onUpload(file);
    } else {
      alert("Please select a valid image file (max 5MB).");
    }
  };

  return (
    <div className="upload-section">
      <h3>Profile Picture</h3>
      {currentProfilePic && (
        <img
          src={currentProfilePic}
          alt="Current profile"
          className="current-profile-pic"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="file-input"
        id="profile-pic-upload"
      />
      <label htmlFor="profile-pic-upload" className="file-input-label">
        {existingPicture ? "Change Profile Picture" : "Upload Profile Picture"}{" "}
      </label>
      <br />

      {selectedFile && <span>Selected: {selectedFile.name}</span>}
    </div>
  );
};

export default ProfilePictureUpload;
