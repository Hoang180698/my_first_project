import React, { useEffect, useRef } from 'react'
import { baseUrl } from '../../App';


function VideoSilder({ url }) {
    const videoRef = useRef(null);
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.0,
      };
    
      const handleIntersection = (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) {
          videoRef.current?.pause();
        }
      };
      useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, options);
        if (videoRef.current) {
          observer.observe(videoRef.current);
        }
    
        return () => {
          if (videoRef.current) {
            observer.unobserve(videoRef.current);
          }
        };
      }, [options, videoRef]);
  return (
    <video ref={videoRef} src={`${baseUrl}${url}`} controls loop/>
  )
}

export default VideoSilder