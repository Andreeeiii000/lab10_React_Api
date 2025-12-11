import React from "react";

function LightboxModal({ image, onClose }) {
  if (!image) return null;

  const { urls, alt_description, user } = image;

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("lightbox-backdrop")) {
      onClose();
    }
  };

  return (
    <div className="lightbox-backdrop" onClick={handleBackdropClick}>
      <div className="lightbox-content">
        <button className="lightbox-close" onClick={onClose}>
          ✕
        </button>
        <img
          src={urls.regular || urls.full || urls.small}
          alt={alt_description || "Photo"}
        />
        <div className="lightbox-caption">
          <span>{alt_description}</span>
          {user && (
            <span className="lightbox-author">
              Автор: {user.name} (@{user.username})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default LightboxModal;
