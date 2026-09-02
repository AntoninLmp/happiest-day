import ScratchCircle from "../ScratchCircle";
import { useRef } from "react";

function ScratchSection() {
  const nbrRevealed = useRef(0); // Compteur pour suivre le nombre de cercles révélés

  const handleReveal = () => {
    nbrRevealed.current += 1;
    if (nbrRevealed.current === 3) {
      document.getElementById("date").style.filter = "blur(0px)";
    }
  };
  return (
    <section className="date-reveal-section bg-[#ffd6d6] text-black instrument-serif-regular">
      <h2 className="instrument-serif-regular bold c-pink3">
        Grattez pour découvrir la date !
      </h2>
      <div className="scratch-row">
        <ScratchCircle label="Jour" value="7" onReveal={handleReveal} />
        <ScratchCircle label="Mois" value="OCT." onReveal={handleReveal} />
        <ScratchCircle label="Année" value="2028" onReveal={handleReveal} />
      </div>
    </section>
  );
}
export default ScratchSection;
