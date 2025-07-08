import { useEffect, useState } from "react";

import Sidebar from "../../component/SideBar.jsx";
import ProfileCard from "../../component/ProfileCard.jsx";
import SearchFilterBar from "../../component/SearchFilterBar.jsx";
import StarRatingBar from "../../component/StarRatingBar.jsx";
import axiosInspector from "../../http/axiosMain.js";
import { useNavigate } from "react-router-dom";
import About from "../../component/About.jsx";
import { useAboutContext } from "../../utils/AboutContext.jsx";
// import { axiosMain } from 'axios';

function MatchesPage() {
  const { ShowAbout, setShowAbout, aboutData, setAboutData } = useAboutContext();

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
      .get("/users/mutuals?start=0&limit=10")
      .then((res) => {
        setProfiles(res.data.list || []); // Adjust based on actual structure
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profiles", err);
        setLoading(false);
      });
  }, []);

  const handleSayHello = () => {
    const targetUserId = matchModal?.id;
    const token = localStorage.getItem("authToken");

    if (!targetUserId || !token) {
      console.error("Missing target user ID or token");
      return;
    }

    axiosInspector
      .post(`/chatrooms?target_user_id=${targetUserId}`, null, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        console.log("Chat room created:", res.data);
        setMatchModal(null);
        navigate("/dashboard/messages");
      })
      .catch((err) => {
        console.error("Failed to create or get chat room", err);
        alert("Something went wrong. Try again!");
      });
  };

  const handleShowAboutUser = (userId) => {
    axiosInspector
      .get(`/users/${userId}/info`)
      .then((res) => {
        console.log("resresresres", res.data);
        // setShowAbout(true)
        setShowAbout(true)
        setAboutData(res.data);
        // setMatchModal(null);
        // navigate("/dashboard/messages");
      })
      .catch((err) => {
        console.error("Failed to create or get chat room", err);
        alert("Something went wrong. Try again!");
      });
  }

  return (
    <>
      {ShowAbout ?
        <About aboutData={aboutData} />
        :
        <>
          <div className="flex bg-gray-100 min-h-screen">
            <div className="flex flex-col w-full gap-4 max-h-screen">
              {/* <StarRatingBar /> */}
              <SearchFilterBar
                profiles={profiles}
                setProfiles={setProfiles}
                setLoading={setLoading}
              />

              {/* Scrollable card list */}
              <div className="flex-1 overflow-y-auto px-10 pt-2 pb-4 custom-scroll">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                        distance={"N/A"}
                        interests={
                          profile.interests?.map((i) => i.e_name).join(", ") ||
                          "N/A"
                        }
                        occupation={profile.occupation?.e_name || "N/A"}
                        rating={profile.score?.toString() || "0"}
                        image={
                          profile.profile_picture ||
                          "https://via.placeholder.com/300"
                        }
                        onInteract={handleInteract}
                        flag={"matches"}
                        handleShowAboutUser={(id) => handleShowAboutUser(id)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          {matchModal && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-xl rounded-2xl p-6 w-[90%] max-w-sm text-center border border-blue-200 z-[9999]">
              {/* Floating hearts (optional small decor) */}
              {/* <div className="absolute top-2 left-4 animate-ping">
            <img
              src="/hearts/pink-heart.png"
              alt=""
              className="w-4 h-4 opacity-60"
            />
          </div>
          <div className="absolute bottom-2 right-4 animate-ping">
            <img
              src="/hearts/blue-heart.png"
              alt=""
              className="w-5 h-5 opacity-60"
            />
          </div> */}

              {/* Heart-framed images */}
              {/* <div className="flex justify-center gap-4 items-center mb-4">
            <div className="relative w-24 h-24 rounded-full border-4 border-cyan-400 overflow-hidden">
              <img
                src={
                  JSON.parse(localStorage.getItem("user_Data"))
                    ?.profile_picture || "/defaultUser.png"
                }
                alt="You"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="relative w-24 h-24 rounded-full border-4 border-cyan-400 overflow-hidden">
              <img
                src={matchModal.profile_picture || "/defaultUser.png"}
                alt={matchModal.name}
                className="object-cover w-full h-full"
              />
            </div>
          </div> */}

              {/* Text */}
              <p className="text-lg text-blue-600 font-semibold mb-3">
                You and <span className="capitalize">{matchModal.name}</span> liked
                each other
              </p>

              {/* Buttons */}
              <button
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6 rounded-full"
                onClick={handleSayHello}
              >
                SAY HELLO!
              </button>

              {/* <button
            className="block mt-3 text-sm text-gray-500 underline"
            onClick={() => setMatchModal(null)}
          >
            Maybe later
          </button> */}
            </div>
          )}</>}


    </>
  );
}

export default MatchesPage;
