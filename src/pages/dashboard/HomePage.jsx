import { useEffect, useState, useRef, useCallback } from "react";
import Sidebar from "../../component/SideBar.jsx";
import ProfileCard from "../../component/ProfileCard";
import SearchFilterBar from "../../component/SearchFilterBar";
import StarRatingBar from "../../component/StarRatingBar";
import axiosInspector from "../../http/axiosMain.js";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [matchModal, setMatchModal] = useState(null);
  const navigate = useNavigate();
  const observer = useRef();

  const handleInteract = (targetUserId, action, data) => {
    axiosInspector
      .post("/users/interact", {
        target_user_id: targetUserId,
        action: action,
      })
      .then((res) => {
        setProfiles((prev) => prev.filter((p) => p.id !== targetUserId));
        if (res.data.is_match) {
          setMatchModal(data);
        }
      })
      .catch((err) => {
        console.error("Interaction failed:", err);
        alert("Interaction failed");
      });
  };

  const loadProfiles = (pageNum = 0) => {
    setLoading(true);
    axiosInspector
      .get(`/users/matches?start=${pageNum * 4}&limit=4`)
      .then((res) => {
        const newProfiles = res.data.list || [];
        setProfiles((prev) => [...prev, ...newProfiles]);
        setHasMore(newProfiles.length === 4);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profiles", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_Data"));
    const userId = localStorage.getItem("userId");

    if (!userData) {
      axiosInspector
        .get(`/users/${userId}/info`)
        .then((res) => {
          localStorage.setItem(
            "user_Data",
            JSON.stringify({
              ...res.data,
              token: localStorage.getItem("authToken"),
            })
          );
        })
        .catch((err) => {
          console.error("Failed to fetch user data", err);
        });
    }

    loadProfiles(0);
  }, []);

  const lastProfileRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            loadProfiles(nextPage);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

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
        setMatchModal(null);
        navigate("/dashboard/messages");
      })
      .catch((err) => {
        console.error("Failed to create or get chat room", err);
        alert("Something went wrong. Try again!");
      });
  };

  return (
    <>
      <div className="flex bg-gray-100 min-h-screen">
        <div className="flex flex-col w-full gap-4 max-h-screen">
          {/* <StarRatingBar /> */}
          <SearchFilterBar
            profiles={profiles}
            setProfiles={setProfiles}
            setLoading={setLoading}
          />

          <div className="flex-1 overflow-y-auto px-10 pt-2 pb-4 custom-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading && profiles.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">
                  Loading...
                </p>
              ) : profiles.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">
                  No matches found.
                </p>
              ) : (
                profiles.map((profile, index) => {
                  const isLast = profiles.length === index + 1;
                  return (
                    <div
                      key={profile.id}
                      ref={isLast ? lastProfileRef : null}
                    >
                      <ProfileCard
                        id={profile.id}
                        name={profile.name}
                        age={profile.age}
                        image={profile.profile_picture}
                        distance={"N/A"}
                        interests={
                          profile.interests
                            ?.map((i) => i.e_name)
                            .join(", ") || "N/A"
                        }
                        occupation={
                          Array.isArray(profile.occupation)
                            ? profile.occupation
                                .slice(0, 2)
                                .map((item) => item.e_name)
                                .join(", ") +
                              (profile.occupation.length > 2 ? "..." : "")
                            : profile.occupation?.e_name || "N/A"
                        }
                        onInteract={handleInteract}
                      />
                    </div>
                  );
                })
              )}
            </div>
            {loading && profiles.length > 0 && (
              <p className="text-center text-sm text-gray-400 mt-4">
                Loading more...
              </p>
            )}
          </div>
        </div>
      </div>

      {matchModal && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-xl rounded-2xl p-6 w-[90%] max-w-sm text-center border border-blue-200 z-[9999]">
          <p className="text-lg text-blue-600 font-semibold mb-3">
            You and <span className="capitalize">{matchModal.name}</span> liked
            each other
          </p>
          <button
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6 rounded-full"
            onClick={handleSayHello}
          >
            SAY HELLO!
          </button>
        </div>
      )}
    </>
  );
}

export default HomePage;
