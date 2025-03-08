import React, { useRef, useState } from "react";

function AudioPlayer({ audioUrl, preDuration }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(preDuration);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current?.duration && audioRef.current?.duration !== Infinity)  {
        setDuration(audioRef.current.duration);
    }
    console.log(audioRef.current?.duration)
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    audioRef.current.currentTime = 0;
  }

  return (
    <div className=" d-flex align-items-center progress-bar mx-auto position-relative">
      <div className="audio-control me-3">
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / duration) * 100 || 0}
          onChange={handleSeek}
        />
      </div>
      <span
        className="photo-video text-center my-auto ms-3 pause-button"
        onClick={togglePlayPause}
      >
        <i
          className={
            isPlaying
              ? "text-white fa-solid fa-circle-stop"
              : "text-white fa-solid fa-circle-play"
          }
        ></i>
      </span>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onCanPlayThroughCapture={handleLoadedMetadata}
        onEnded={handleEnd}
        className="d-none"
      />
      <span
        // onClick={() => stopRecording()}
        className="photo-video text-center my-auto ms-auto timer-bar"
      >
        {`00:${Math.floor(duration - currentTime)}`}
      </span>
    </div>
  );
}

export default AudioPlayer;
