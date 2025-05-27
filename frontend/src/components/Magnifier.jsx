import React, { useState, useRef } from "react";

export default function ImageMagnifier({ src, width = 400, height = 300, zoom = 2 }) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierX, setMagnifierX] = useState(0);
  const [magnifierY, setMagnifierY] = useState(0);
  const imgRef = useRef(null);

  const magnifierSize = 150; // diameter of magnifier lens

  function handleMouseMove(e) {
    const { top, left } = imgRef.current.getBoundingClientRect();

    // Calculate cursor position relative to image
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;

    // Clamp values so magnifier stays inside image
    const xPos = Math.max(magnifierSize / (2 * zoom), Math.min(x, width - magnifierSize / (2 * zoom)));
    const yPos = Math.max(magnifierSize / (2 * zoom), Math.min(y, height - magnifierSize / (2 * zoom)));

    setMagnifierX(xPos);
    setMagnifierY(yPos);
    setShowMagnifier(true);
  }

  function handleMouseLeave() {
    setShowMagnifier(false);
  }

  return (
    <div
      style={{ position: "relative", width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={src}
        alt="Magnifiable"
        style={{ width, height, display: "block" }}
        ref={imgRef}
      />

      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            // Position magnifier slightly to the right and down
            top: magnifierY - magnifierSize / 2,
            left: magnifierX - magnifierSize / 2,
            width: magnifierSize,
            height: magnifierSize,
            borderRadius: "50%",
            border: "3px solid #000",
            backgroundColor: "white",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            // Zoomed background size
            backgroundSize: `${width * zoom}px ${height * zoom}px`,
            // Background position to create zoom effect
            backgroundPositionX: `-${magnifierX * zoom - magnifierSize / 2}px`,
            backgroundPositionY: `-${magnifierY * zoom - magnifierSize / 2}px`,
          }}
        />
      )}
    </div>
  );
}
