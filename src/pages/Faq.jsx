import React, { useState } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Tooltip from "@mui/material/Tooltip";

export default function Faq() {
  const [activeTab, setActiveTab] = useState("Support");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
    uploadedImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData((prev) => ({ ...prev, uploadedImage: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      alert("File must be less than 5MB");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone Number is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) console.log("Form submitted:", formData);
  };

  return (
    <div
      className="max-w-6xl mx-auto p-6 bg-white rounded-2xl"
      style={{ boxShadow: "0px 0px 4px 0px #00000026" }}
    >
      <h1 className="text-2xl font-medium text-gray-800 mb-8">Help Center</h1>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex justify-between items-end">
          <div className="w-1/2 text-center">
            <button
              onClick={() => setActiveTab("FAQ")}
              className={`pb-2 font-medium text-sm ${
                activeTab === "FAQ"
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              FAQ
            </button>
          </div>
          <div className="w-1/2 text-center">
            <button
              onClick={() => setActiveTab("Support")}
              className={`pb-2 font-medium text-sm ${
                activeTab === "Support"
                  ? "text-black font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Support
            </button>
          </div>
        </div>
        <div className="flex h-1 w-full rounded-full overflow-hidden mt-1">
          <div className="w-1/2 bg-red-200" />
          <div className="w-1/2 bg-cyan-400" />
        </div>
      </div>

      {activeTab === "Support" && (
        <div className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name*
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Use full name (as it appears on your ID)"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number*
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+977 Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message*
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              placeholder="Tell us more about your issue..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Upload Image + Photo Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              {/* File Upload */}
              <div className="w-full max-w-md">
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-between px-3 py-3 bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-full cursor-pointer hover:bg-gray-200 transition"
                >
                  {formData.uploadedImage
                    ? formData.uploadedImage.name
                    : "Attach an image"}
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/png, image/jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="mt-1 text-xs text-gray-400">
                  Max 5MB, JPG/PNG only
                </p>
              </div>

              {/* Photo & Gallery Buttons */}
              <div className="flex gap-4 mt-2 md:mt-0">
                <Tooltip title="Take a photo" arrow>
                  <button className="flex flex-col items-center gap-1">
                    <div className="bg-cyan-400 text-white rounded-xl p-3 hover:bg-cyan-500 transition">
                      <PhotoCameraIcon />
                    </div>
                    <span className="text-xs text-black">Take a photo</span>
                  </button>
                </Tooltip>

                <Tooltip title="Choose from Gallery" arrow>
                  <button className="flex flex-col items-center gap-1">
                    <div className="bg-red-300 text-white rounded-xl p-3 hover:bg-red-400 transition">
                      <PhotoLibraryIcon />
                    </div>
                    <span className="text-xs text-black">
                      Choose from Gallery
                    </span>
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 rounded-xl max-h-40 border border-gray-200 object-contain"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-3 px-6 rounded-md
 transition duration-200 text-sm"
            >
              SUBMIT YOUR QUERY
            </button>
          </div>
        </div>
      )}

      {activeTab === "FAQ" && (
        <div className="text-center py-12">
          <p className="text-gray-500">FAQ content would go here...</p>
        </div>
      )}
    </div>
  );
}
