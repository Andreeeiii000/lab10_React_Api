import React from "react";

function ImageCard({ image, onClick }) {
  const { urls, alt_description, user } = image;

  return (
    <div className="image-card" onClick={onClick}>
      <img
        src={urls.small}
        alt={alt_description || "Photo"}
        loading="lazy"
      />
      <div className="image-info">
        <span className="author">{user?.name}</span>
      </div>
    </div>
  );
}

export default ImageCard;
