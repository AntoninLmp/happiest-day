function Letter({ isOpen, setIsOpen }) {
  return (
    <div className={`invitation ${isOpen ? "open" : ""}`}>
      <div className="envelope-wrapper" onClick={() => setIsOpen(true)}>
        <div className="absolute top-[10%] text-black text-center w-full">
          <p className="instrument-serif-regular text-xl uppercase tracking-wider">
            Une lettre de
          </p>
          <p className="mea-culpa-regular text-4xl mt-4!">Elisa & Antonin</p>
        </div>
        <img
          src="images/letter_green_mobile.png"
          alt="Fleur"
          className="paper-image"
        />
        <div className="absolute uppercase bottom-[25%] instrument-serif-regular tracking-wider paper-text text-center w-full">
          Ouvrir votre invitation
        </div>
      </div>
    </div>
  );
}
export default Letter;
