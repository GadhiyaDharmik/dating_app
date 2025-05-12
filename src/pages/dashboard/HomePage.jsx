import { useEffect, useState } from "react";

import Sidebar from "../../component/SideBar.jsx";
import ProfileCard from "../../component/ProfileCard";
import SearchFilterBar from "../../component/SearchFilterBar";
import StarRatingBar from "../../component/StarRatingBar";
import axiosInspector from "../../http/axiosMain.js";
import { useNavigate } from "react-router-dom";
// import { axiosMain } from 'axios';

function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleInteract = (targetUserId, action) => {
    axiosInspector
      .post("/users/interact", {
        target_user_id: targetUserId,
        action: action, // "like"
      })
      .then(() => {
        console.log(`Successfully sent '${action}' for user ${targetUserId}`);
        // You can also update UI, show a toast, etc.
        navigate("/dashboard/messages");
      })
      .catch((err) => {
        console.error("Interaction failed:", err);
        alert("Interaction failed");
      });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_Data"));
    const userId = localStorage.getItem("userId");

    if (!userData) {
      axiosInspector
        .get(`/users/${userId}/info`)
        .then((res) => {
          const user = res.data;
          // setProfiles(res.data.list || []); // Adjust based on actual structure
          // setLoading(false);
          localStorage.setItem(
            "user_Data",
            JSON.stringify({
              ...user,
              token: localStorage.getItem("authToken"),
            })
          );
        })
        .catch((err) => {
          console.error("Failed to fetch profiles", err);
          setLoading(false);
        });
    }

    axiosInspector
      .get("/users/matches?start=0&limit=10")
      .then((res) => {
        setProfiles(res.data.list || []); // Adjust based on actual structure
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profiles", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full gap-4">
        <StarRatingBar />
        <SearchFilterBar />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-10 pt-4">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Loading...
            </p>
          ) : profiles.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No matches found.
            </p>
          ) : (
            profiles.map((profile, index) => (
              <ProfileCard
                id={profile.id}
                key={index}
                name={profile.name}
                age={profile.age}
                distance={"N/A"} // you can later calculate if available
                interests={
                  profile.interests?.map((i) => i.e_name).join(", ") || "N/A"
                }
                occupation={profile.occupation?.e_name || "N/A"}
                rating={profile.score?.toString() || "0"}
                image={
                  profile.profile_picture || "https://via.placeholder.com/300"
                }
                onInteract={handleInteract} // 🔥 send function
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
