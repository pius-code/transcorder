import React, { useEffect, useState, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPause } from "@fortawesome/free-solid-svg-icons";
import Button from "../Components/Button";
import { locationContext } from "../Components/RecordedLoc";
import "../globals.css";

const Recorder = () => {
  const audioRef = useRef(null);
  const [timer, setTimer] = useState("00:00:00");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [stopped, setStopped] = useState(true);
  const timeRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const { src, setSrc } = useContext(locationContext);

  // Convert blob to WAV format
  const convertToWav = async (audioBlob) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    // Create WAV file
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels * 2;
    const buffer = new ArrayBuffer(44 + length);
    const view = new DataView(buffer);

    // Write WAV header
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, length, true);

    // Write audio data
    const offset = 44;
    const channelData = [];
    for (let i = 0; i < numberOfChannels; i++) {
      channelData.push(audioBuffer.getChannelData(i));
    }

    let index = 0;
    while (index < audioBuffer.length) {
      for (let i = 0; i < numberOfChannels; i++) {
        const sample = channelData[i][index] * 0x7fff;
        view.setInt16(
          offset + (index * numberOfChannels + i) * 2,
          sample < 0
            ? Math.max(-0x8000, Math.floor(sample))
            : Math.min(0x7fff, Math.ceil(sample)),
          true
        );
      }
      index++;
    }

    return new Blob([buffer], { type: "audio/wav" });
  };

  useEffect(() => {
    const initializeRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          },
        });

        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
          audioBitsPerSecond: 128000,
        });

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstart = () => {
          chunksRef.current = [];
        };

        mediaRecorder.onerror = (error) => {
          console.error("MediaRecorder error:", error);
          alert(`Recording error: ${error.message}`);
        };
      } catch (error) {
        console.error("Initialization error:", error);
        alert(
          `Microphone access error: ${error.message}. Please ensure you've granted microphone permissions in your browser settings.`
        );
      }
    };

    initializeRecorder();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  function startTimer() {
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

      const newTimer =
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
      setTimer(newTimer);
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timeRef.current);
    timeRef.current = null;
    setTimer("00:00:00");
  }

  const save = () => {
    if (!mediaRecorderRef.current) {
      alert("Recorder not initialized");
      return;
    }

    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    setTimeout(async () => {
      if (chunksRef.current.length === 0) {
        alert("No audio recorded. Please try again.");
        return;
      }

      try {
        const webmBlob = new Blob(chunksRef.current, {
          type: "audio/webm;codecs=opus",
        });

        if (webmBlob.size === 0) {
          alert("No audio data captured.");
          return;
        }

        const wavBlob = await convertToWav(webmBlob);
        const url = URL.createObjectURL(wavBlob);
        setSrc((prevSrc) => [...prevSrc, url]);
        setStopped(true);
        setIsRecording(false);
        setIsPaused(true);
        resetTimer();
        chunksRef.current = [];
      } catch (error) {
        console.error("Error converting audio:", error);
        alert("Error saving audio. Please try again.");
      }
    }, 100);
  };

  const deleter = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setStopped(true);
    setIsRecording(false);
    setIsPaused(true);
    resetTimer();
    chunksRef.current = [];
  };

  const startRecording = () => {
    if (!mediaRecorderRef.current) {
      alert(
        "Recorder not initialized. Please ensure microphone permissions are granted and reload the page."
      );
      return;
    }

    startTimer();
    setIsRecording(true);
    setIsPaused(false);

    try {
      if (stopped) {
        chunksRef.current = [];
        mediaRecorderRef.current.start(100);
        setStopped(false);
      } else {
        mediaRecorderRef.current.resume();
      }
    } catch (error) {
      console.error("Recording error:", error);
      alert(
        `Failed to start recording: ${error.message}. Please check microphone permissions.`
      );
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    setIsPaused(true);
    setIsRecording(false);
    clearInterval(timeRef.current);
    timeRef.current = null;
    mediaRecorderRef.current.pause();
  };

  return (
    <div className="flex flex-col justify-center items-center m-14 w-60">
      <button className="flex justify-center items-center h-64">
        {!isRecording ? (
          <FontAwesomeIcon
            icon={faMicrophone}
            size="8x"
            style={{ color: "white", margin: "10px" }}
            onClick={startRecording}
            className="bg-[#3e41430b] rounded-full w-60 h-64 border-2  focus:border-[#692bb5] m-6 flex justify-center items-center hover:bg-[#6c252525] p-10  border-purple-300"
          />
        ) : (
          <FontAwesomeIcon
            icon={faPause}
            size="8x"
            style={{ color: "white", margin: "10px" }}
            onClick={pauseRecording}
            className="bg-[#de4b5025] rounded-full w-60 h-64 border-2 border-transparent focus:border-[#45505e] m-6 flex justify-center items-center p-10"
          />
        )}
      </button>

      <div className="bg-[#7b7d7f25] w-44 h-16 text-4xl font-semibold flex justify-center items-center rounded-full">
        {timer}
      </div>

      <div className="controls flex justify-center items-center mt-20">
        <Button Name="save" onClick={save} />
        <Button
          Name="delete"
          onClick={deleter}
          xstyles={"bg-gray-200 text-black hover:bg-gray-400"}
        />
      </div>
    </div>
  );
};

export default Recorder;
