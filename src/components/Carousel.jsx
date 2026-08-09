import { useState } from "react";

function Carousel({ items = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) {
    return null;
  }

  const prevItem = () => {
    setCurrentIndex((index) =>
      index === 0 ? items.length - 1 : index - 1
    );
  };

  const nextItem = () => {
    setCurrentIndex((index) =>
      index === items.length - 1 ? 0 : index + 1
    );
  };

  return (
    <div className="carousel mx-auto max-w-xl">
      <div className="carousel-image mb-4 overflow-hidden rounded-xl border border-gray-300 h-[350px]">
        <img
          src={items[currentIndex].src}
          alt={items[currentIndex].alt}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex items-center justify-between mb-3 h-4">
        <button
          type="button"
          onClick={prevItem}
          className="rounded px-4 py-2 text-black relative top-[-200px] h-[350px]"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/271/271228.png" alt="Previous" className="w-4 h-4 inline-block rotate-180" />
        </button>

        <span className="text-sm text-gray-700">
          {currentIndex + 1} / {items.length}
        </span>

        <button
          type="button"
          onClick={nextItem}
          className="rounded px-4 py-2 text-black relative top-[-200px] h-[350px]"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/271/271228.png" alt="Next" className="w-4 h-4 inline-block" />
        </button>
      </div>

      <div className="flex justify-center gap-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-3 w-3 rounded-full ${
              idx === currentIndex ? "bg-black" : "bg-gray-300"
            }`}
            aria-label={`Aller à l'image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;