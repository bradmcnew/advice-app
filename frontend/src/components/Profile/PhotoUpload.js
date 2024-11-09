import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfilePicture } from "../../features/profile/profileSlice";

/**
 * PhotoUpload Component
 * Handles profile picture upload functionality
 * Includes file selection, preview, and upload capabilities
 */
const PhotoUpload = () => {
  // Local state for file and preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Redux state management
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.profile);

  /**
   * Handles file selection
   * Creates preview URL and validates file
   * @param {Event} event - File input change event
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    // Validate file type
    if (file && !file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  /**
   * Handles file upload
   * Dispatches upload action to Redux
   * @param {Event} event - Form submission event
   */
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    try {
      await dispatch(uploadProfilePicture(formData)).unwrap();
      // Clear form after successful upload
      setSelectedFile(null);
      setPreviewUrl(null);
      alert("Profile picture uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="photo-upload">
      <h2>Upload Profile Picture</h2>

      {/* Upload form */}
      <form onSubmit={handleUpload}>
        {/* File input */}
        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="form-control"
          />
        </div>

        {/* Preview section */}
        {previewUrl && (
          <div className="preview-section">
            <h3>Preview:</h3>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </div>
        )}

        {/* Upload button */}
        <button
          type="submit"
          disabled={!selectedFile || loading}
          className="upload-button"
        >
          {loading ? "Uploading..." : "Upload Photo"}
        </button>
      </form>

      {/* Error display */}
      {error && <div className="error-message">Error: {error.message}</div>}
    </div>
  );
};

export default PhotoUpload;
