function Letter({ isOpen, setIsOpen }) {
  return (
    <div className={`invitation ${isOpen ? "open" : ""}`}>
      <div className="w-full h-full grid place-items-center" onClick={() => setIsOpen(true)}>
        <div className="absolute top-[10%] text-black text-center">
          <p className="instrument-serif-regular text-xl uppercase tracking-wider">Une lettre de</p>
          <p className="mea-culpa-regular text-4xl mt-4!">Elisa & Antonin</p>
        </div>
        <img
          src="images/letter_white.png"
          alt="Fleur"
          className="paper-image"
        />
        <div className="absolute uppercase bottom-[25%] instrument-serif-regular tracking-wider paper-text ">Ouvrir votre invitation</div>
      </div>
    </div>
  );
}
export default Letter;
