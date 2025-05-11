import React from "react";
import bgImage from "../assets/bgImage.png";
import bgCouplePhoto from "../assets/bgCouplePhoto.png";
import logoFull from "../assets/logoFull.png";

function MainSignUp({
  children,
  titleText,
  text,
  hasButton,
  buttonText = "NEXT",
  hasSkip,
  onButtonClick,    // ← new
  onSkipClick      // ← optional skip handler
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Side */}
        <div
          className="md:w-1/2 relative flex items-center justify-center bg-cover bg-center rounded-l-2xl"
          style={{ backgroundImage: `url(${bgCouplePhoto})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00A3E0]/70 to-[#00D4FF]/70 z-0 rounded-l-xl"></div>
          <div className="relative z-10 text-center text-white flex flex-col items-center justify-center p-8 space-y-4">
            <img
              src={logoFull}
              alt="Logo"
              style={{ filter: "brightness(0) invert(1)", width: "70%" }}
              className="mb-4"
            />
            <h1 className="text-xl md:text-2xl font-bold max-w-xs md:max-w-sm leading-snug text-balance">
              {titleText || "Your Missing Piece is Here"}
            </h1>
            <p className="text-sm md:text-base max-w-xs md:max-w-sm leading-relaxed text-balance">
              {text || "Create your profile and dive in."}
            </p>

            <div className="flex gap-x-4 justify-between">
              {hasButton && (
                <button
                  type="button"                 // ← ensure it doesn’t auto‐submit
                  onClick={onButtonClick}       // ← wire up the callback
                  className="mt-4 px-5 py-2 rounded-lg bg-white shadow-md hover:shadow-lg transition"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3E0] to-[#00D4FF] font-semibold">
                    {buttonText}
                  </span>
                </button>
              )}
              {hasSkip && (
                <button
                  type="button"
                  onClick={onSkipClick}
                  className="mt-4 px-5 py-2 rounded-lg transition"
                >
                  <span className="text-transparent bg-clip-text font-semibold bg-white">
                    SKIP FOR NOW
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="md:w-4/5 bg-gradient-to-br from-[#00A3E0]/70 to-[#00A3E0]">
          <div className="rounded-xl p-10 bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default MainSignUp;
