import { useState, useEffect } from "react";
import "./App.css";
import Letter from "./components/Letter";
import Message from "./components/Message";
import ScratchCircle from "./components/ScratchCircle";
import CountdownUntil from "./components/Countdownuntil";
import Carousel from "./components/Carousel";

const REVEAL_TOTAL_MS = 10000; // durée avant de passer à la page principale

function App() {
  const [stage, setStage] = useState("closed"); // 'closed' | 'message' | 'open'

  const envelopeOpen = stage !== "closed";
  const messageVisible = stage === "message";
  const pageVisible = stage === "open";

  useEffect(() => {
    document.body.style.overflow = pageVisible ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [pageVisible]);

  const handleOpenEnvelope = () => {
    if (stage !== "closed") return;
    setStage("message");
    setTimeout(() => {
      setStage("open");
    }, REVEAL_TOTAL_MS);
  };

  const carouselItems = [
    { src: "https://www.le-colombier-bayeux.fr/wp-content/uploads/2025/04/009.jpg", alt: "Décor 2" },
    { src: "https://www.le-colombier-bayeux.fr/wp-content/uploads/2025/04/001.jpg", alt: "Décor 1" },
    { src: "https://www.le-colombier-bayeux.fr/wp-content/uploads/2025/04/DJI_0024.jpg", alt: "Décor 3" },
    { src: "https://cdn0.mariages.net/vendor/1999/3_2/640/jpeg/img-5746_3_371999-176045267880362.webp", alt: "Décor 3" },
    { src: "https://cdn0.mariages.net/vendor/1999/3_2/960/jpg/lamapix-63511150_3_371999-174323254314969.webp", alt: "Décor 4" },
  ];

  return (
    <div className="app">
      <Letter isOpen={envelopeOpen} setIsOpen={handleOpenEnvelope} />

      <Message visible={messageVisible} />

      <main className={`page ${pageVisible ? "visible" : ""}`}>
        <section>
          <img src="images/Home_webbing.png" alt="Arche en fleur" />
        </section>
        <section className="date-reveal-section bg-[#f2d5a9] text-black instrument-serif-regular">
          <h2 className="instrument-serif-regular c-green2">
            Grattez pour découvrir la date !
          </h2>
          <div className="scratch-row">
            <ScratchCircle label="Jour" value="14" />
            <ScratchCircle label="Mois" value="SEPT" />
            <ScratchCircle label="Année" value="2028" />
          </div>
        </section>
        <section className="text-center">
          <div className="flex items-center justify-center pb-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3085/3085472.png"
              alt="icon"
              className="w-6 h-6 inline-block mr-2"
            />
            <h1 className="instrument-serif-regular c-green2">
              Lieu de réception
            </h1>
          </div>
          <p className="instrument-serif-regular c-green2">
            Le Colombier du Manoir
          </p>
          <p className="instrument-serif-regular c-green2 mb-4!">
            Le Manoir 14710 Mandeville-en-Bessin (Calvados)
          </p>
          <Carousel items={carouselItems} />
        </section>
        <section>
          <CountdownUntil />
        </section>
      </main>
    </div>
  );
}

export default App;
