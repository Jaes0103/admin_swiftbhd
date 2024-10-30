// LazyImage.js
import React, { useEffect, useRef, useState } from 'react';
import '../style/LazyImages.css'

const LazyImage = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : ""}
      data-src={src}
      alt={alt}
      loading="lazy"
      style={{ opacity: isVisible ? 1 : 0.5, transition: "opacity 0.5s" }}
    />
  );
};

export default LazyImage;
