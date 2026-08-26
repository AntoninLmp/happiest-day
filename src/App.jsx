import { useState, useEffect } from "react";
import "./App.css";
import Letter from "./components/Letter";
import Message from "./components/Message";
import ScratchSection from "./components/section/ScratchSection";
import CountdownSection from "./components/section/CountdownSection";
import DressCodeSection from "./components/section/DressCodeSection";
import PlaceSection from "./components/section/PlaceSection";

function SectionDivider() {
  return <div className="section-divider" aria-hidden="true" />;
}

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

  return (
    <div className="app">
      <Letter isOpen={envelopeOpen} setIsOpen={handleOpenEnvelope} />

      <Message visible={messageVisible} />

      <main className={`page ${pageVisible ? "visible" : ""} w-full `}>
        <section>
          <picture>
            <source media="(min-width: 768px)" srcSet="images/Home_webbing_paysage2.png" className="w-full" />
            <img src="images/Home_webbing.png" alt="Arche en fleur" className="w-full" />
          </picture>
        </section>
        <ScratchSection />

        <section className="text-center mb-5">
          <img src="images/polaroid2.png" alt="icon" className="mx-auto mt-5" />
          <SectionDivider />
          <h1 className="instrument-serif-regular c-green2">
            Nous nous marions !
          </h1>
          <p className="instrument-serif-regular c-green2 mx-10! text-xl">
            Nous avons l'immense joie de vous annoncer notre mariage qui aura
            lieu le <span className="underline" id="date"> 7 octobre 2028</span> . <br />
            Nous vous invitons à célébrer ce moment unique avec nous. <br /><br />

            Le "Save the date" est une invitation à réserver cette date dans vos
            agendas pour partager ce  <span className=" italic">jour exceptionnel</span>. <br />
            Les informations complémentaires concernant le programme de la journée vous seront communiquées ultérieurement. <br /><br />

            Ce site a été réalisé par Antonin et désigné par Elisa. 
          </p>
        </section>
        <SectionDivider />
        {/* SECTION Avec le lieu */}
        <PlaceSection />

        <SectionDivider />
        {/* SECTION DRESS CODE */}
        <DressCodeSection />

        {/* SECTION COMPTE A REBOURS */}
        <CountdownSection />

        
      </main>
    </div>
  );
}

export default App;
