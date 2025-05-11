import { useEffect, useState } from "react";

import Sidebar from "../../component/SideBar.jsx";
import ProfileCard from "../../component/ProfileCard";
import SearchFilterBar from "../../component/SearchFilterBar";
import StarRatingBar from "../../component/StarRatingBar";
import axiosInspector from "../../http/axiosMain.js";
// import { axiosMain } from 'axios';

function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData =
      JSON.parse(localStorage.getItem("user_Data"));
    const userId =
      localStorage.getItem("userId")

    if (!userData) {
      axiosInspector
        .get(`/users/${userId}/info`)
        .then((res) => {
          const user = res.data;
          // setProfiles(res.data.list || []); // Adjust based on actual structure
          // setLoading(false);
          localStorage.setItem("user_Data", JSON.stringify({ ...user, token: localStorage.getItem("authToken") }));

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
            <p className="col-span-full text-center text-gray-500">Loading...</p>
          ) : profiles.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No matches found.</p>
          ) : (
            profiles.map((profile, index) => (
              <ProfileCard
                key={index}
                name={profile.name}
                age={profile.age}
                distance={profile.distance || "N/A"}
                interests={profile.interests?.join(", ") || "N/A"}
                occupation={profile.occupation || "N/A"}
                rating={profile.rating || "0"}
                image={profile.image || "https://via.placeholder.com/300"} // use placeholder or profile.photo
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
