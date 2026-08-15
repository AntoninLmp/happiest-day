function Letter({ isOpen, setIsOpen }) {
  return (
    <div className={`invitation ${isOpen ? "open" : ""}`}>
      <div className="envelope-wrapper md:envelope-large" onClick={() => setIsOpen(true)}>
        <div className="absolute top-[10%] text-black text-center md:w-full lg:w-[50%]">
          <p className="instrument-serif-regular text-xl uppercase tracking-wider">
            Une lettre de
          </p>
          <p className="mea-culpa-regular text-4xl mt-4!">Elisa & Antonin</p>
        </div>
        <picture>
          <source media="(min-width: 768px)" srcSet="images/letter_computer.png" className="w-5 md:rounded-lg md:shadow-lg md:shadow-[#a2ad8d] md:w-[50%] md:h-[50%] md:mx-auto"/>
          <img
            src="images/letter_green_mobile.png"
            alt="Fleur"
            className="paper-image"
          />
        </picture>
        <div className="sm:absolute md:relative uppercase bottom-[25%] instrument-serif-regular tracking-wider paper-text text-center w-full md:mt-10">
          Ouvrir votre invitation
        </div>
      </div>
    </div>
  );
}
export default Letter;
