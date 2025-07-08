import React, { createContext, useContext, useState } from "react";

const AboutContext = createContext();

export const AboutProvider = ({ children }) => {
  const [ShowAbout, setShowAbout] = useState(false);
  const [aboutData, setAboutData] = useState(null);

  return (
    <AboutContext.Provider value={{ ShowAbout, setShowAbout, aboutData, setAboutData }}>
      {children}
    </AboutContext.Provider>
  );
};

export const useAboutContext = () => useContext(AboutContext);
