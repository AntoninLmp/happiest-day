import React, { useState, useRef } from "react";

const Photomaton = () => {
  // Liste de vos vidéos
  const videos = [
    "./images/photomaton.mp4",
    "./images/photomaton1.mp4",
    "./images/photomaton2.mp4",
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  
  // Tableau de références pour accéder à chaque élément vidéo
  const videoRefs = useRef([]);

  const handleToggle = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);

    const activeVideo = videoRefs.current[currentVideoIndex];
    if (checked && activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play();
    } else if (activeVideo) {
      activeVideo.pause();
    }
  };

  const handleVideoEnded = () => {
    setTimeout(() => {
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      setCurrentVideoIndex(nextIndex);
  
      // Pré-réinitialisation du curseur de la prochaine vidéo pour un départ propre au prochain clic
      if (videoRefs.current[nextIndex]) {
        videoRefs.current[nextIndex].currentTime = 0;
      }
      setIsChecked(false);
      document.getElementById("toggle-photomaton").click(); // Déclenche le clic sur le bouton pour le remettre à zéro
    }, 2000);
  };
  
  return (
    <div className="text-center mb-5">
      <h1 className="instrument-serif-regular c-green2">Le photomaton !</h1>
      <p className="instrument-serif-regular c-green2 mb-5! text-xl">
        Découvrez des petits bout de notre histoire à travers ce photomaton.
        Cliquer sur la manivelle pour lancer l'impression des photos, puis 
        recommencez autant de fois que vous le souhaitez pour découvrir d'autres souvenirs. <br />
        Amusez-vous bien ! 🌿
      </p>
      <div className="photomaton-container">
        {videos.map((src, index) => (
          <video
            key={src}
            ref={(el) => (videoRefs.current[index] = el)}
            src={src}
            width="1000px"
            height="1000px"
            className="rounded-lg"
            preload="auto"
            onEnded={handleVideoEnded}
            playsInline
            style={{
              top: 0,
              left: 0,
              opacity: index === currentVideoIndex ? 1 : 0,
              display: index === currentVideoIndex ? "block" : "none",
              pointerEvents: index === currentVideoIndex ? "auto" : "none",
              transition: "opacity 0.2s ease-in-out",
            }}
          />
        ))}
      </div>

      <div className="toggle-container md:left-45 md:-top-112.5 left-32.5 -top-95">
        <input
          id="toggle-photomaton"
          className="toggle-input"
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
        />
        <div className="toggle-handle-wrapper">
          <div className="toggle-handle">
            <div className="toggle-handle-knob"></div>
            <div className="toggle-handle-bar-wrapper">
              <div className="toggle-handle-bar"></div>
            </div>
          </div>
        </div>
        <div className="toggle-base">
          <div className="toggle-base-inside"></div>
        </div>
      </div>
    </div>
  );
};

export default Photomaton;
