import tick from "../assets/tick.png";
import cross from "../assets/cross.png";
import star from "../assets/star.png";
import heart from "../assets/heart.png";
import blueheart from "../assets/blueheart.png";
import goldenheart from "../assets/goldenheart.png";

const ProfileCard = ({
  id,
  name,
  age,
  distance,
  interests,
  occupation,
  rating,
  image,
  onInteract
}) => {
  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-sm lg:max-w-xs xl:max-w-sm h-[22rem] rounded-2xl overflow-hidden shadow-lg mx-auto">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-300 ease-in-out"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      {/* Top-left badge */}
      <div className="absolute h-10 w-20 top-0 left-0 flex items-center backdrop-blur-lg text-white px-2 py-1 rounded-br-3xl text-sm z-10">
        <img
          src={goldenheart}
          alt="golden heart"
          className="absolute top-2 w-6"
        />
        <img
          src={blueheart}
          alt="blue heart"
          className="absolute left-2 top-4 w-6 h-3 object-contain"
        />
        <span className="absolute left-10">{rating}</span>
      </div>

      {/* Verified badge */}
      <div className="absolute top-2 right-2 p-1 rounded-full z-10">
        <img src={tick} alt="verified" className="w-6 sm:w-6 md:w-7" />
      </div>

      {/* Action Buttons */}
      {/* Action Buttons */}
      <div className="absolute bottom-20 w-full flex justify-center items-center gap-4 sm:gap-6 z-20">
        <button className="bg-red-300 h-8 w-8 sm:h-9 sm:w-9 p-1 rounded-full shadow-md hover:bg-red-100 border-white border-2">
          <img
            src={cross}
            alt="cross"
            className="w-full h-full object-contain"
          />
        </button>
        <button
          className="bg-sky-400 h-10 w-10 sm:h-11 sm:w-11 p-1.5 rounded-full shadow-md hover:bg-red-100 border-white border-2"
          onClick={() => onInteract(id, "like")} // 🔥 use callback
        >
          <img
            src={heart}
            alt="heart"
            className="w-full h-full object-contain"
          />
        </button>
        <button className="bg-red-300 h-8 w-8 sm:h-9 sm:w-9 p-1 rounded-full shadow-md hover:bg-red-100 border-white border-2">
          <img src={star} alt="star" className="w-full h-full object-contain" />
        </button>
      </div>

      {/* Profile details */}
      <div className="absolute bottom-0 w-full backdrop-blur-lg bg-black/40 text-white pt-6 pb-2 px-4 text-center z-10">
        <h2 className="text-sm md:text-base font-semibold">
          {name}, {age}Yr, {distance}
        </h2>
        <p className="text-xs md:text-sm mt-1">
          <strong>Interests:</strong> {interests}
        </p>
        <p className="text-xs md:text-sm">
          <strong>Occupation:</strong> {occupation}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
