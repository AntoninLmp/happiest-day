import { useState, useEffect } from "react";
import "../App.css"; 
import Letter from "./Letter";
import Message from "./Message";
import ScratchSection from "./section/ScratchSection";
import CountdownSection from "./section/CountdownSection";
import DressCodeSection from "./section/DressCodeSection";
import PlaceSection from "./section/PlaceSection";
import { Link } from "react-router-dom";

function SectionDivider() {
  return <div className="section-divider" aria-hidden="true" />;
}

const REVEAL_TOTAL_MS = 8500; // durée avant de passer à la page principale

function Home() {
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
          {/* <picture>
            <source media="(min-width: 768px)" srcSet="images/Home_webbing_paysage2.png" className="w-full" />
            <img src="images/Home_webbing.png" alt="Arche en fleur" className="w-full" />
          </picture> */}
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet="images/kids_english_paysage.png"
              className="w-full"
            />
            <img src="images/kids_english.png" alt="Fleur" className="" />
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
            Nous avons l'immense joie de vous annoncer notre mariage. <br />
            Le{" "}
            <span className="underline" id="date">
              {" "}
              7 octobre 2028
            </span>
            , entourés de ceux qui comptent le plus pour nous, nous nous dirons
            oui.
            <br />
            <br />
            Le "Save the date" est une invitation à réserver cette date dans vos
            agendas pour partager ce{" "}
            <span className=" italic">jour exceptionnel</span>. 🌿 <br />
            Le programme complet de la journée vous parviendra un peu plus tard.
            En attendant, on vous laisse savourer la nouvelle avec nous. <br />
            Ce petit coin du web a été codé par Antonin, et habillé de fleurs
            par Elisa.
          </p>
          <Link to="/histoire">
            <button
              type="button"
              className="bg-[#a2ad8d] instrument-serif-regular p-2 rounded mt-3"
            >
              Découvrir notre histoire
            </button>
          </Link>
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

export default Home;
