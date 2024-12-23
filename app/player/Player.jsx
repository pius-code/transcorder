import React, { useState, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "../globals.css";
import { locationContext } from "../Components/RecordedLoc";

const Player = (props) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const audioRef = useRef(null);
  const { src } = useContext(locationContext);

  const handlePlayPause = () => {
    audioRef.current.play();
    console.log(src);
  };

  const handleSliderChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const calculateTrackBackground = () => {
    const progressPercentage = (currentTime / duration) * 100 || 0;
    return `linear-gradient(to right, #e7d5d5 ${progressPercentage}%, #756d6d ${
      progressPercentage + 0.1
    }%)`;
  };

  return (
    <div className="bg-[#3d3f40b3] w-full h-48 rounded-xl p-6 flex flex-col justify-between">
      <audio
        ref={audioRef}
        src={props.yourSrc || "counts.wav"}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div>
        <h4 className="font-bold text-2xl">VoiceName</h4>
      </div>
      <div className="playPause flex justify-center ">
        <button className="play" onClick={handlePlayPause}>
          <FontAwesomeIcon icon={playing ? faPause : faPlay} size="3x" />
        </button>
      </div>
      <div className="slider-container">
        <input
          type="range"
          id="songSlider"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSliderChange}
          style={{
            background: calculateTrackBackground(),
          }}
          className="slider w-full h-0 bg-black rounded-lg cursor-pointer focus:outline-none"
        />
      </div>
    </div>
  );
};

export default Player;
