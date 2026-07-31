import { useState, useEffect } from "react";
import "./App.css";
import Letter from "./components/Letter";
import Message from "./components/Message";
import ScratchCircle from "./components/ScratchCircle";

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

  return (
    <div className="app">
      <Letter isOpen={envelopeOpen} setIsOpen={handleOpenEnvelope} />

      <Message visible={messageVisible} />

      <main className={`page ${pageVisible ? "visible" : ""}`}>
        <section className="date-reveal-section bg-amber-100 text-black instrument-serif-regular">
          <h2 className="instrument-serif-regular">Grattez pour découvrir la date !</h2>
          <div className="scratch-row">
            <ScratchCircle label="Jour" value="14" />
            <ScratchCircle label="Mois" value="SEPT" />
            <ScratchCircle label="Année" value="2026" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
