import React, { useEffect, useState } from "react";

function TimerBar({ stopRecord }) {
    const [process, setProcess] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setProcess(process + 0.1);
        }, 100);     
        //Clearing the interval
        if(process > 59) {
            stopRecord();
        }
        return () => {
            clearInterval(interval);
        } 
    },[process])
  return (
    <div
      className="d-flex align-items-center progress-bar mx-auto position-relative"
    >
        <div className="progress-bar-fill me-auto" style={{width:`${process * 1.66}%`}}>
            
        </div>
      <span
        onClick={() => stopRecord(process)}
        className="photo-video text-center my-auto ms-3 pause-button"
      >
        <i className="text-white fa-solid fa-circle-stop"></i>
      </span>
      <span
        // onClick={() => stopRecording()}
        className="photo-video text-center my-auto ms-auto timer-bar"
      >
        {`00:${Math.floor(process)}`}
      </span>
    </div>
  );
}

export default TimerBar;
