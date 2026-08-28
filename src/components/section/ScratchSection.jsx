import ScratchCircle from "../ScratchCircle";

function ScratchSection() {
    return (
        <section className="date-reveal-section bg-[#ffd6d6] text-black instrument-serif-regular">
          <h2 className="instrument-serif-regular bold c-pink3">
            Grattez pour découvrir la date !
          </h2>
          <div className="scratch-row">
            <ScratchCircle label="Jour" value="7" />
            <ScratchCircle label="Mois" value="OCT." />
            <ScratchCircle label="Année" value="2028" />
          </div>
        </section>
    )
}
export default ScratchSection;