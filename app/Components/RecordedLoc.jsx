import React, { createContext, useState } from "react";
import "../styles/globals.css";

export const locationContext = createContext();

const RecordedLoc = ({ children }) => {
  const [src, setSrc] = useState([]);

  return (
    <locationContext.Provider value={{ src, setSrc }}>
      {children}
    </locationContext.Provider>
  );
};

export default RecordedLoc;
