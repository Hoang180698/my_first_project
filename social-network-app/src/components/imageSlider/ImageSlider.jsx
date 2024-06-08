import React, { useState } from "react";
import "./Slider.css";
import VideoSilder from "./VideoSilder";
import { baseUrl } from "../../App";

function imageSlider({ data }) {
  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    setSlide(slide === data.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? data.length - 1 : slide - 1);
  };

  if (data.length === 0) {
    return;
  }

  if (data.length === 1) {
    const url = data[0];
    return (
      <div className="post-image d-flex position-relative">
        {url.includes("api/images") && <img src={`${baseUrl}${data[0]}`} />}
        {url.includes("api/videos") && <VideoSilder url={url}/>}
      </div>
    );
  }
  return (
    <div className="post-image d-flex position-relative">
      {data.map((item, idx) => {
        return (
          <div key={idx} className={slide === idx ? "" : "d-none"}>
            {item.includes("api/images") && (
              <img
                src={`${baseUrl}${item}`}
                className={slide === idx ? "" : "d-none"}
              />
            )}
              {item.includes("api/videos") && (
              <VideoSilder url={item}/>
            )}
          </div>
        );
      })}
      <button className="btn prev-slide" onClick={prevSlide}>
        <i className="fa-solid fa-circle-chevron-left"></i>
      </button>
      <button className="btn next-slide" onClick={nextSlide}>
        <i className="fa-solid fa-circle-chevron-right"></i>
      </button>
      <span className="indicators">
        {data.map((_, idx) => {
          return (
            <span
              key={idx}
              className={
                slide === idx ? "indicator" : "indicator indicator-inactive"
              }
              onClick={() => setSlide(idx)}
            ></span>
          );
        })}
      </span>
    </div>
  );
}

export default imageSlider;
