import React, { useState } from "react";
import { Camera, X, Upload } from "lucide-react";
import axios from "axios";
import Button from "../common/Button";
import { getImageUrl } from "../../utils/imageUtils";
import toast from "react-hot-toast";

const ProfileImageUpload = ({ currentImage, onImageUpdate }) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setUploading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      // Create FormData
      const formData = new FormData();
      formData.append("profile_image", selectedFile);

      // Upload image
      const response = await axios.post(
        `${API_URL}/users/me/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Update local state
      const imageUrl = response.data.data.profile_image;
      setPreview(imageUrl);
      setSelectedFile(null);

      // Callback to parent
      if (onImageUpdate) {
        onImageUpdate(imageUrl);
      }

      toast.success("Profile image updated!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setUploading(true);
      const API_URL = process.env.REACT_APP_API_URL;
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/users/me/profile-image`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPreview(null);
      setSelectedFile(null);

      if (onImageUpdate) {
        onImageUpdate(null);
      }

      toast.success("Profile image removed");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove image");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(currentImage);
    setSelectedFile(null);
  };

  // Get display URL for preview
  const getDisplayUrl = () => {
    if (!preview) return null;

    // If it's a blob URL or data URL (local preview), use as-is
    if (preview.startsWith("blob:") || preview.startsWith("data:")) {
      return preview;
    }

    // For server images, construct proper URL
    const SERVER_URL =
      process.env.REACT_APP_API_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";
    const path = preview.startsWith("/") ? preview : `/${preview}`;

    return `${SERVER_URL}${path}`;
  };

  const displayUrl = getDisplayUrl();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        {/* Image Preview */}
        <div className="relative">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              onError={(e) => {
                console.error("Image failed to load:", displayUrl);
                e.target.style.display = "none";
                toast.error("Failed to load image");
              }}
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
              <Camera className="h-10 w-10 text-gray-400" />
            </div>
          )}

          {/* Remove button */}
          {preview && !uploading && (
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <input
            type="file"
            id="profile-image-input"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <div className="space-y-2">
            <label
              htmlFor="profile-image-input"
              className={`inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg transition ${
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Camera className="h-4 w-4 mr-2" />
              Choose Image
            </label>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {selectedFile && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleUpload}
            loading={uploading}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={uploading}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};;

export default ProfileImageUpload;
