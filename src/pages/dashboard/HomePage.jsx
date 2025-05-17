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
  const [matchModal, setMatchModal] = useState(null); // stores matched user data

  const handleInteract = (targetUserId, action, data) => {
    axiosInspector
      .post("/users/interact", {
        target_user_id: targetUserId,
        action: action,
      })
      .then((res) => {
        setProfiles((prev) => prev.filter((p) => p.id !== targetUserId));

        if (res.data.is_match) {
          setMatchModal(data); // trigger modal
        }
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
      <div className="flex flex-col w-full gap-4">
        <StarRatingBar />
        <SearchFilterBar profiles={profiles} setProfiles={setProfiles} setLoading={setLoading} />

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
      {matchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl text-center shadow-xl relative max-w-sm w-full">
            {/* Heart and Images */}
            <div className="flex justify-center gap-2 mb-4 relative">
              <img
                src={"https://via.placeholder.com/300"}
                alt="You"
                className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover"
              />
              <img
                src={matchModal.profile_picture || "https://via.placeholder.com/300"}
                alt={matchModal.name || "N/A"}
                className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover"
              />
            </div>

            <p className="text-xl font-semibold text-[#00A3E0] mb-2">
              You and {matchModal.name || "N/A"} liked each other
            </p>

            <div className="flex justify-center gap-3 mt-6">
              <button
                className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-6 py-2 rounded-full font-semibold"
                onClick={() => {
                  setMatchModal(null);
                  navigate("/dashboard/messages");
                }}
              >
                SAY HELLO!
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-6 text-sm font-medium">
              <button
                className="text-pink-600 underline"
                onClick={() => {
                  navigate(`/dashboard/profile/${matchModal.id}`);
                  setMatchModal(null);
                }}
              >
                VIEW PROFILE
              </button>
              <button
                className="text-gray-600"
                onClick={() => setMatchModal(null)}
              >
                MAYBE LATER
              </button>
            </div>
          </div>
        </div>
      )}

    </div>


  );
}

export default HomePage;
