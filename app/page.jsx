"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Recorder from "./Recorder/Recorder";
import Player from "./Player/Player";
import RecordedLoc from "./Components/RecordedLoc";

const Page = () => {
  const [show, setShow] = useState(false);
  const [recApp, setRecApp] = useState(true);
  const [audioUrls, setAudioUrls] = useState([]);
  const showRecFiles = () => {
    setShow(!show);
    setRecApp(!recApp);
  };

  // Function to add the recorded audio URL to state
  const addAudioUrl = (url) => {
    setAudioUrls((prevUrls) => [...prevUrls, url]);
  };

  // Function to go back from the "recorder files" view
  const goBack = () => {
    setShow(false);
    setRecApp(!recApp);
  };

  return (
    <RecordedLoc>
      <div className="bg-[#0c0d15] w-full h-[100vh] p-5 gap-8 flex">
        <div
          className={`recfiles w-[60%] bg-[#2e2b2b6d] rounded-xl lg:flex py-2 px-3 ${
            !show ? "hidden" : "flex w-full p-3 flex-col "
          }`}
        >
          <button
            className="h-5 mb-6 mt-2 mx-2 lg:hidden flex"
            onClick={goBack}
          >
            <FontAwesomeIcon icon={faChevronLeft} size="2x" />
          </button>
          <Player />
        </div>

        {recApp && (
          <div className="recorderApp w-full h-full flex flex-col justify-center items-center bg-[#2e2b2b6d] rounded-xl p-3">
            <div className="tools flex w-full flex-row justify-between px-3 ">
              <button onClick={showRecFiles} className="lg:hidden">
                <FontAwesomeIcon icon={faBars} size="2x" />
              </button>
            </div>

            <div className="flex-grow">
              <Recorder addAudioUrl={addAudioUrl} />{" "}
            </div>
          </div>
        )}
      </div>
    </RecordedLoc>
  );
};

export default Page;
