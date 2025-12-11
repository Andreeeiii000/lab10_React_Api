import React from "react";
import ImageCard from "./ImageCard.jsx";

function ImageGrid({ images, onImageClick }) {
  return (
    <div className="image-grid">
      {images.map((img) => (
        <ImageCard key={img.id} image={img} onClick={() => onImageClick(img)} />
      ))}
    </div>
  );
}

export default ImageGrid;
