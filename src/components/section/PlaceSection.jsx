import Carousel from "../Carousel";


 const carouselItems = [
    { src: "https://www.le-colombier-bayeux.fr/wp-content/uploads/2025/04/009.jpg", alt: "Décor 1" },
    { src: "https://www.le-colombier-bayeux.fr/wp-content/uploads/2025/04/001.jpg", alt: "Décor 2" },
    { src: "https://www.le-colombier-bayeux.fr/wp-content/uploads/2025/04/DJI_0024.jpg", alt: "Décor 3" },
    { src: "https://cdn0.mariages.net/vendor/1999/original/1280/jpeg/img-5746_3_371999-176045267880362.webp", alt: "Décor 4" },
    { src: "https://cdn0.mariages.net/vendor/1999/3_2/960/jpg/img-95133_3_371999-174323326914620.webp", alt: "Décor 5" },
    { src: "https://cdn0.mariages.net/vendor/1999/3_2/960/jpg/lamapix-63511150_3_371999-174323254314969.webp", alt: "Décor 6" },
  ];
  
function PlaceSection() {
    return (
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
            <button className="border border-[#555b39] rounded p-2 bg-[#898c79] text-white">
              <a href="https://maps.app.goo.gl/cN2snQF4B1fs63Kw9" target="_blank" rel="noopener noreferrer">
                Voir sur Google Maps
              </a>
            </button>
          </div>
        </section>
    )
}
export default PlaceSection;