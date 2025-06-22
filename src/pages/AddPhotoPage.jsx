import React, { useRef, useState } from "react";
import MainSignUp from "../component/MainSignUp";
import { Plus, Edit, Trash2 } from "lucide-react";
import axiosMain from "../http/axiosMain";
import { useNavigate } from "react-router-dom";

function AddPhotoPage() {
  const formRef = useRef();
  const navigate = useNavigate();
  const [isLoding, setIsLoding] = useState(false)

  return (
    <MainSignUp
      titleText="You can add up to 10 photos or skip and add later"
      text="It will Display on your Profile and you will not be able to change it later"
      hasButton={true}
      hasSkip={false}
      onSkipClick={() => navigate("/profile/ideal-match")}
      onButtonClick={() => formRef.current?.requestSubmit()}
      buttonText={isLoding ? "Loading..." : "NEXT"}
    >
      <AddPhotoComponent formRef={formRef} setIsLoding={setIsLoding} />
    </MainSignUp>
  );
}

function AddPhotoComponent({ formRef, setIsLoding }) {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const maxPhotos = 10;
  const [errorMessage, setErrorMessage] = useState("");


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxPhotos - photos.length;

    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more photo(s).`);
    }

    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: reader.result,
            file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPhoto = () => {
    setErrorMessage("");
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
            prev.map((p) =>
              p.id === id ? { ...p, url: reader.result, file } : p
            )
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

    if (photos.length < 2) {
      setErrorMessage("Please upload at least 2 photos to continue.");
      return;
    }

    setErrorMessage("");

    setIsLoding(true)
    const token =
      JSON.parse(localStorage.getItem("user_Data"))?.token ||
      localStorage.getItem("authToken");
    const userData =
      JSON.parse(localStorage.getItem("user_Data"))?.id ||
      localStorage.getItem("userId");

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
      if (res.data) {
        setIsLoding(true)
      }
      navigate("/profile/ideal-match");
    } catch (error) {
      console.error("❌ Upload Error", error);
      alert("Upload failed.");
    }
  };

  return (
    <form
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
      }}
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
        multiple // ✅ Multiple selection
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="overflow-y-auto max-h-[320px] pr-1">
        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-3xl overflow-hidden shadow-md group"
            >
              <img
                src={photo.url}
                alt="Uploaded"
                className="w-full h-40 object-cover"
              />

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md">
                <button
                  type="button"
                  onClick={() => handleEditPhoto(photo.id)}
                  className="bg-pink-100 text-pink-600 p-2 rounded-full hover:bg-pink-200 transition-all"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="bg-pink-100 text-pink-600 p-2 rounded-full hover:bg-pink-200 transition-all"
                >
                  <Trash2 size={16} />
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

      {/* Error Message */}
      {errorMessage && (
        <div className="text-center text-red-600 mt-35 font-small" style={{fontSize:"14px"}}>
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export default AddPhotoPage;
