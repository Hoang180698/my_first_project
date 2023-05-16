import React, { useState } from "react";
import "./Slider.css"

function imageSlider({ data }) {
    const [slide, setSlide] = useState(0);

    const nextSlide = () => {
      setSlide(slide === data.length - 1 ? 0 : slide + 1);
    };
  
    const prevSlide = () => {
      setSlide(slide === 0 ? data.length - 1 : slide - 1);
    };

    if(data.length === 0) {
        return;
    }
  
    if (data.length === 1) {
        return (
            <div className="post-image d-flex position-relative">
                <img src={`http://localhost:8080${data[0]}`}/>
            </div>
        )
    }
    return (
        <div className="post-image d-flex position-relative">
        {data.map((item, idx) => {
          return (
            <img
              src={`http://localhost:8080${item}`}
              key={idx}
              className={slide === idx ? "" : "d-none"}
            />
          );
        })}
         <button className="btn prev-slide" onClick={prevSlide}><i className="fa-solid fa-chevron-left"></i></button>
         <button className="btn next-slide" onClick={nextSlide}><i className="fa-solid fa-chevron-right"></i></button>
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
