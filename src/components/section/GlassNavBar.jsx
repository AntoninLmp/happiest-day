import { useState } from "react";
import { Home, Search, Heart, User, Mails, Info } from "lucide-react";
import { Link } from "react-router-dom";

// Barre de navigation translucide (effet "glassmorphism") façon Instagram,
// à placer en bas de l'écran. 4 catégories, entièrement personnalisables.

const DEFAULT_ITEMS = [
  { id: "home", label: "Invitation", icon: Home, road: "/home" },
  { id: "search", label: "Histoire", icon: Heart, road: "/histoire" },
  { id: "likes", label: "Programme", icon: Info, road: "/" },
  { id: "profile", label: "Confirmation", icon: Mails, road: "/" },
];

export default function GlassNavBar({ items = DEFAULT_ITEMS, onChange }) {
  const [active, setActive] = useState(items[0].id);

  const handleClick = (id) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-full bg-[#898c79]
                   backdrop-blur-xl backdrop-saturate-150
                   border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
      >
        {items.map(({ id, label, icon: Icon, road }) => {
          const isActive = active === id;
          return (
            <Link to={road} key={id}>
              <button
                key={id}
                onClick={() => handleClick(id)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex flex-col items-center justify-center
                            w-16 h-14 rounded-full transition-all duration-300 ease-out
                            ${
                              isActive
                                ? "bg-white/40 scale-105"
                                : "bg-transparent hover:bg-white/10"
                            }`}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={`transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/70"
                  }`}
                />
                <span
                  className={`text-[10px] mt-0.5 font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                >
                  {label}
                </span>

                {/* {isActive && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white" />
                )} */}
              </button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}