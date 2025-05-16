import tick from "../assets/tick.svg";
import cross from "../assets/cross.svg";
import star from "../assets/star.svg";
import heart from "../assets/heart.svg";
import blueheart from "../assets/blueheart.png";
import goldenheart from "../assets/goldenheart.svg";

const ProfileCard = ({
  id,
  name,
  age,
  distance,
  interests,
  occupation,
  rating,
  image,
  onInteract,
}) => {
  return (
    <div className="relative w-full max-w-[290px] h-[24rem] rounded-3xl overflow-hidden shadow-2xl  bg-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10"></div>

      {/* Rating Badge */}
      <div className="rating-badge absolute top-0 left-0 z-20 flex items-center text-white text-sm">
        <div className="relative w-8 h-8">
          <img src={goldenheart} alt="golden heart" className="w-full h-full" />
          <img src={blueheart} alt="blue heart" className="blueheart-icon" />
        </div>
        <span className="ml-2 font-semibold">{rating}</span>
      </div>

      {/* Verified Tick */}
      <div className="absolute top-2 right-2 z-20 tick-badge">
  <img src={tick} alt="verified" className="w-4 h-4" />
</div>



      {/* Action Buttons */}
      <div className="action-buttons absolute bottom-20 w-full z-20 flex justify-center items-center gap-3">
        <div className="flex flex-col items-center">
          <button className="cross-button h-10 w-10 p-2 rounded-full shadow-md border-2 border-white">
            <img
              src={cross}
              alt="pass"
              className="w-full h-full object-contain"
            />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="heart-button h-12 w-12 p-2 rounded-full shadow-md border-2 border-white"
            onClick={() => onInteract(id, "like")}
          >
            <img
              src={heart}
              alt="heart"
              className="w-full h-full object-contain"
            />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <button className="star-button h-10 w-10 p-2 rounded-full shadow-md border-2 border-white">
            <img
              src={star}
              alt="like"
              className="w-full h-full object-contain"
            />
          </button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className=" bottom-card-bar absolute bottom-0 w-full text-white text-center px-4 pb-3 pt-4 z-20 backdrop-blur-md bg-black/40 rounded-t-xl">
        <h2 className="mt-3 user-detail text-base font-semibold">
          {name}, {age}Yr, {distance}
        </h2>

        <p className="text-sm interest-user">
          <strong>Interests</strong>:
          {Array.isArray(interests)
            ? ` ${interests.slice(0, 2).join(", ")}${
                interests.length > 2 ? "..." : ""
              }`
            : ` ${interests.split(",").slice(0, 2).join(", ")}${
                interests.split(",").length > 2 ? "..." : ""
              }`}
        </p>

        <p className="text-sm interest-user">
          <strong>Occupation</strong>: {occupation?.split(",")[0] || occupation}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
