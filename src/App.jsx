import { useState, useEffect } from "react";
import "./App.css";
import Letter from "./components/Letter";
import Message from "./components/Message";
import ScratchCircle from "./components/ScratchCircle";
import CountdownUntil from "./components/Countdownuntil";
import Carousel from "./components/Carousel";

const REVEAL_TOTAL_MS = 8500; // durée avant de passer à la page principale

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
        <section className="date-reveal-section bg-[#a2ad8d] text-black instrument-serif-regular">
          <h2 className="instrument-serif-regular c-green2">
            Grattez pour découvrir la date !
          </h2>
          <div className="scratch-row">
            <ScratchCircle label="Jour" value="7" />
            <ScratchCircle label="Mois" value="OCT." />
            <ScratchCircle label="Année" value="2028" />
          </div>
        </section>

        {/* SECTION Avec le lieu */}
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
          <div className="mt-3">
            <button className="border-1 border-[#555b39] rounded p-2 bg-[#898c79] text-white">
              <a href="https://maps.app.goo.gl/cN2snQF4B1fs63Kw9" target="_blank" rel="noopener noreferrer">
                Voir sur Google Maps
              </a>
            </button>
          </div>
        </section>

        {/* SECTION COMPTE A REBOURS */}
        <section>
          <div className="flex items-center justify-center pb-2 pt-5">
            <img
                src="https://cdn-icons-png.flaticon.com/512/3085/3085472.png"
                alt="icon"
                className="w-6 h-6 inline-block mr-2"
              />
            <h1 className="instrument-serif-regular c-green2">Compte à rebours</h1>
          </div>
          <CountdownUntil />
        </section>

        <section className="bg-white mb-10">
          <div className="flex items-center justify-center pb-2 pt-5">
            <img
                src="https://cdn-icons-png.flaticon.com/512/3085/3085472.png"
                alt="icon"
                className="w-6 h-6 inline-block mr-2"
              />
            <h1 className="instrument-serif-regular c-green2">Dress Code</h1>
          </div>
          <img src="images/dresscode2.png" alt="" />
          <div>
            <h2 className="instrument-serif-regular c-pink bg-[#ffd9dc] text-center p-2 my-3! mx-auto! w-max rounded-2xl">
              Tenues Colorées
            </h2>
            <p className="instrument-serif-regular c-pink3 text-center px-4 font-bold">
              Attendez-vous à une explosion de couleurs et de fleurs ! <br />
              
            </p>
            <div className="h-15 flex items-center justify-center gap-4 mt-3">
              <button className="w-8 h-8 bg-[#837f28] rounded-2xl"></button>
              <button className="w-8 h-8 bg-[#ed7171] rounded-2xl"></button>
              <button className="w-8 h-8 bg-[#fce56b] rounded-2xl"></button>
              <button className="w-8 h-8 bg-[#ee6e04] rounded-2xl"></button>
              <button className="w-8 h-8 bg-[#7a236c] rounded-2xl"></button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
