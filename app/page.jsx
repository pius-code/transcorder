"use client";
import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Recorder from "./Recorder/Recorder";
import Player from "./Play/Player";
import RecordedLoc from "./Components/RecordedLoc";
import { locationContext } from "./Components/RecordedLoc";
import "./globals.css";
import { initializeStatusBar } from "./statusbar";

const Page = () => {
  const [show, setShow] = useState(false);
  const [recApp, setRecApp] = useState(true);
  const { src } = useContext(locationContext);

  const showRecFiles = () => {
    setShow(!show);
    setRecApp(!recApp);
  };

  const goBack = () => {
    setShow(false);
    setRecApp(!recApp);
  };

  return (
    <div className="bg-[#f2eeee] dark:bg-[#030008] w-full h-[100vh] p-5 gap-8 flex">
      <div
        className={`recfiles w-[60%] bg-[#e2e0e0d2] dark:bg-[#100c10]  rounded-xl lg:flex py-2 px-3 ${
          !show ? "hidden" : "flex w-full p-3 flex-col "
        }`}
      >
        <button
          className="h-14 mb-6 mt-2 mx-2 lg:hidden flex bg-[#585b5a] dark:bg-[#4d4c4c] w-12 rounded-full
          justify-center items-center"
          onClick={goBack}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size="2x"
            style={{ color: "white" }}
          />
        </button>
        <div className="flex flex-col gap-4 w-full h-full overflow-y-auto">
          {Array.isArray(src) && src.length > 0 ? (
            src
              .slice()
              .reverse()
              .map((current, index) => {
                return (
                  <Player
                    yourSrc={src[src.length - 1]}
                    key={index}
                    name={`00${src.length - index}`}
                  />
                );
              })
          ) : (
            <p className="flex justify-center items-center h-[75%] font-semibold text-2xl text-black dark:text-white">
              No recorded files
            </p>
          )}
        </div>
      </div>

      {recApp && (
        <div className="recorderApp w-full h-full flex flex-col justify-center items-center bg-[#2e2b2b00] rounded-xl p-3">
          <div className="tools flex w-full flex-row justify-between px-3 ">
            <button onClick={showRecFiles} className="lg:hidden">
              <FontAwesomeIcon icon={faBars} size="2x" />
            </button>
          </div>

          <div className="flex-grow">
            <Recorder />
          </div>
        </div>
      )}
    </div>
  );
};

const Appn = () => {
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    // Function to handle theme changes
    const handleThemeChange = (e) => {
      initializeStatusBar(e.matches);
    };

    // Initial setup
    handleThemeChange(prefersDark);

    // Listen for theme changes
    prefersDark.addEventListener("change", handleThemeChange);

    return () => {
      prefersDark.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return (
    <RecordedLoc>
      <Page />
    </RecordedLoc>
  );
};

export default Appn;
