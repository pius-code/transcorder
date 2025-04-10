import React, { useEffect, useState, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPause } from "@fortawesome/free-solid-svg-icons";
import Button from "../Components/Button";
import { locationContext } from "../Components/RecordedLoc";
import { VoiceRecorder } from "capacitor-voice-recorder";
import "../globals.css";

const Recorder = () => {
  const [timer, setTimer] = useState("00:00:00");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeRef = useRef(null);
  const { src, setSrc } = useContext(locationContext);

  useEffect(() => {
    const initializeRecorder = async () => {
      try {
        await VoiceRecorder.requestAudioRecordingPermission();
        const result = await VoiceRecorder.canDeviceVoiceRecord();
        if (!result.value) {
          alert("Device does not support audio recording.");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        alert("Microphone access error: " + error.message);
      }
    };

    initializeRecorder();
  }, []);

  const startTimer = () => {
    if (timeRef.current) return;
    const parts = timer.split(":");
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    let seconds = parseInt(parts[2], 10);
    timeRef.current = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        minutes++;
        seconds = 0;
      }
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
      setTimer(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(timeRef.current);
    timeRef.current = null;
    setTimer("00:00:00");
  };

  const convertToWav = async (base64String) => {
    try {
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);

      const channelData = audioBuffer.getChannelData(0);
      const wavData = createWavFile(channelData, audioBuffer.sampleRate);

      const blob = new Blob([wavData], { type: "audio/wav" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("WAV conversion error:", error);
      throw error;
    }
  };

  const createWavFile = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // WAV header
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); // Mono channel
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    // PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return buffer;
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const save = async () => {
    try {
      const recording = await VoiceRecorder.stopRecording();
      const { value } = recording;

      const wavUrl = await convertToWav(value.recordDataBase64);
      setSrc((prevSrc) => [...prevSrc, wavUrl]);
      resetStates();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving audio as WAV");
    }
  };

  const resetStates = () => {
    setIsRecording(false);
    setIsPaused(false);
    resetTimer();
  };

  const startRecording = async () => {
    try {
      if (isPaused) {
        // Resume recording if paused
        await VoiceRecorder.resumeRecording();
        startTimer();
        setIsPaused(false);
        setIsRecording(true);
      } else {
        // Start a new recording
        await VoiceRecorder.startRecording();
        startTimer();
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Error starting/resuming recording:", error);
      alert("Error starting/resuming recording");
    }
  };

  const pauseRecording = async () => {
    try {
      await VoiceRecorder.pauseRecording();
      setIsPaused(true);
      setIsRecording(false);
      clearInterval(timeRef.current);
      timeRef.current = null;
    } catch (error) {
      console.error("Error pausing recording:", error);
      alert("Error pausing recording");
    }
  };

  const stopRecording = async () => {
    try {
      await VoiceRecorder.stopRecording();
      resetStates();
    } catch (error) {
      console.error("Error stopping recording:", error);
      alert("Error stopping recording");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center m-14 w-60 h-90">
      <button className="flex justify-center items-center h-48 m-5">
        {!isRecording ? (
          <FontAwesomeIcon
            icon={faMicrophone}
            size="5x"
            onClick={startRecording}
            className="bg-red-200 rounded-full h-28 w-28 border-2 border-red-400 dark:bg-[#3b1919] dark:border-red-500 hover:bg-red-300 dark:hover:dark:bg-[#361717] p-10"
          />
        ) : (
          <FontAwesomeIcon
            icon={faPause}
            size="5x"
            onClick={pauseRecording}
            className="bg-[#d6618c7f] hover:bg-[#b651767f] dark:bg-[#8f596f] dark:hover:bg-[#814a5f] rounded-full h-28 w-28  p-10"
          />
        )}
      </button>

      <div className="bg-[#b6bbc1c2] dark:bg-[#44505ec2] w-44 h-16 text-4xl font-semibold flex justify-center items-center rounded-full mt-14">
        {timer}
      </div>

      <div className="controls flex justify-center items-center mt-20">
        <Button Name="save" onClick={save} />
        <Button
          Name="delete"
          onClick={stopRecording}
          xstyles={"bg-gray-800 text-white hover:bg-gray-700"}
        />
      </div>
    </div>
  );
};

export default Recorder;
