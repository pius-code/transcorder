import React, { useState, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faDownload } from "@fortawesome/free-solid-svg-icons";
import { locationContext } from "../Components/RecordedLoc";
import "../globals.css";
import Filewindow from "../audioWindow/Filewindow";

const Player = (props) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const audioRef = useRef(null);
  const { src } = useContext(locationContext);
  const [isVisible, setIsVisible] = useState(false);

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = audioRef.current.src;
    link.download = `voice${props.name}.mp3`;
    link.click();
  };

  const handlePlayPause = (event) => {
    console.log("i was clicked to play");
    event.stopPropagation();
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
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

  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const calculateTrackBackground = () => {
    const progressPercentage = (currentTime / duration) * 100 || 0;
    return `linear-gradient(to right, #e7d5d5 ${progressPercentage}%, #756d6d ${
      progressPercentage + 0.1
    }%)`;
  };

  const openFile = () => {
    setIsVisible(true);
    console.log("i was clicked");
    return <Filewindow />;
  };

  return (
    <div
      className="bg-[#e9eaea] dark:bg-[#302f30f9] w-full rounded-xl p-6 flex flex-col justify-between h-20"
      onClick={openFile}
    >
      <audio
        ref={audioRef}
        src={props.yourSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
      />
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-2xl">{`Voice${props.name}`}</h4>
        <div className="playPause flex justify-center">
          <button className="play" onClick={handlePlayPause}>
            <FontAwesomeIcon icon={playing ? faPause : faPlay} size="2x" />
          </button>
        </div>
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
          className="slider w-full h-0 bg-black rounded-lg cursor-pointer focus:outline-none hidden"
        />
      </div>
      <div className="w-[100%] h-[90%]">{isVisible && <Filewindow />}</div>
    </div>
  );
};

export default Player;
