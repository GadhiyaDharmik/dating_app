import React, { useRef, useState } from "react";
import MainSignUp from "../component/MainSignUp";
import { Plus, Edit, Trash2 } from "lucide-react";
import axiosMain from "../http/axiosMain";
import { useNavigate } from "react-router-dom";

function AddPhotoPage() {
  const formRef = useRef();
  const navigate = useNavigate()
  return (
    <MainSignUp
      titleText="You can add up to 10 photos or skip and add later"
      text="It will Display on your Profile and you will not be able to change it later"
      hasButton={true}
      hasSkip={true}
      onSkipClick={() => navigate("/profile/ideal-match")
      }

      onButtonClick={() => formRef.current?.requestSubmit()}
    >
      <AddPhotoComponent formRef={formRef} />
    </MainSignUp>
  );
}

function AddPhotoComponent({ formRef }) {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate()
  const maxPhotos = 10;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && photos.length < maxPhotos) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, { id: Date.now(), url: reader.result, file }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = () => {
    fileInputRef.current.click();
  };

  const handleEditPhoto = (id) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos((prev) =>
            prev.map((p) => (p.id === id ? { ...p, url: reader.result, file } : p))
          );
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleDeletePhoto = (id) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("user_Data"))?.token || localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("user_Data"))?.id || localStorage.getItem("userId");

    if (!token || !userData) {
      alert("Missing token or user ID.");
      return;
    }

    const formData = new FormData();
    photos.forEach((photo) => {
      if (photo.file) {
        formData.append("files", photo.file);
      }
    });

    try {
      const res = await axiosMain.post(
        `/users/${userData}/gallary`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );
      console.log("✅ Upload Success", res.data);
      // alert("Photos uploaded successfully!");
      navigate("/profile/ideal-match")
    } catch (error) {
      console.error("❌ Upload Error", error);
      alert("Upload failed.");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl w-full min-h-[400px] max-h-[600px]"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Add Photo and Complete Profile
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Add high-quality images to showcase yourself.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="overflow-y-auto max-h-[320px] pr-1">
        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-xl overflow-hidden shadow group"
            >
              <img
                src={photo.url}
                alt="Uploaded"
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-1 right-1 flex gap-1">
                <button
                  type="button"
                  onClick={() => handleEditPhoto(photo.id)}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                >
                  <Edit size={14} className="text-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}

          {photos.length < maxPhotos && (
            <div
              onClick={handleAddPhoto}
              className="flex items-center justify-center rounded-xl h-32 transition cursor-pointer bg-gradient-to-br from-[#FF999980] to-[#FF9999] text-white hover:opacity-90"
            >
              <Plus size={32} />
            </div>
          )}
        </div>
      </div>

      {/* Optional Submit Button (visible fallback if needed) */}
      {/* {photos.length > 0 && (
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700 transition"
          >
            Upload All Photos
          </button>
        </div>
      )} */}
    </form>
  );
}

export default AddPhotoPage;
