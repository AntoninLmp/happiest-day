import { useState, useEffect } from "react";
import "../App.css"; 
import Letter from "./Letter";
import Message from "./Message";
import ScratchSection from "./section/ScratchSection";
import CountdownSection from "./section/CountdownSection";
import DressCodeSection from "./section/DressCodeSection";
import PlaceSection from "./section/PlaceSection";
import { Link } from "react-router-dom";
import GlassNavBar from "./section/GlassNavBar";
import Photomaton from "./section/Photomaton";

function SectionDivider() {
  return <div className="section-divider" aria-hidden="true" />;
}

const REVEAL_TOTAL_MS = 8500; // durée avant de passer à la page principale

function Home({isLetter}) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [stage, setStage] = useState( !isLetter ? "open" : "closed"); // 'closed' | 'message' | 'open'

  const envelopeOpen = stage !== "closed";
  const messageVisible = stage === "message";
  const pageVisible = stage === "open";

  const handleReveal = () => {
    setRevealedCount((prevCount) => prevCount + 1);
  };

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
      {isLetter && (
        <>
          <Letter isOpen={envelopeOpen} setIsOpen={handleOpenEnvelope} />
          <Message visible={messageVisible} />
        </>
      )}

      <main className={`page ${pageVisible ? "visible" : ""} w-full`}>
        <section className="bg-[#ffd6d6]">
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet="images/kids_pink_paysage.png"
              className="w-full"
            />
            <img src="images/kids_pink.png" alt="Fleur" className="m-auto" />
          </picture>
        </section>
        <ScratchSection />

        <section className="text-center mb-5 ">
          {/* <img src="images/polaroid2.png" alt="icon" className="mx-auto mt-5" /> */}
          <h1 className="instrument-serif-regular c-green2">
            Nous nous marions !
          </h1>
          <p className="instrument-serif-regular c-green2 mx-10! text-xl">
            Nous avons l'immense joie de vous annoncer notre mariage. <br />
            Le{" "}
            <span className="underline" id="date" style={{ filter: "blur(5px)" }}>
              {" "}
              7 octobre 2028
            </span>
            , entourés de ceux qui comptent le plus pour nous, nous nous dirons
            oui pour la vie.
            <br />
            <br />
            Le "Save the date" est une invitation à réserver cette date dans vos
            agendas pour partager ce{" "}
            <span className=" italic">jour exceptionnel</span> avec nous.
            <br />
            Le programme complet de la journée vous parviendra un peu plus tard.
            En attendant, on vous laisse savourer la nouvelle avec nous. <br />
            PS: Ce site web a été codé par Antonin, et désigné par son acolyte,
            Elisa.
          </p>
          <img
            src="./images/flowers.png"
            alt="polaroid"
            className="mx-auto w-90"
          />
        </section>
        {/* SECTION Avec le lieu */}
        <SectionDivider />
          <PlaceSection />
        <SectionDivider />
          <Photomaton />
        {/* SECTION DRESS CODE */}
        {/* <DressCodeSection /> */}

        {/* SECTION COMPTE A REBOURS */}
        <CountdownSection />
        <GlassNavBar index={0} bgColors="bg-[#fee2e5]" />
      </main>
    </div>
  );
}

export default Home;
