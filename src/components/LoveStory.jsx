import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  ChevronDown,
  Dog,
  Plane,
  PawPrint,
  Bed,
  Armchair,
  Lamp,
  Bike,
  Flower2,
  BookOpen,
} from "lucide-react";
import GlassNavBar from "./section/GlassNavBar";

/* =========================================================================
   TOKENS
   Palette imposée : sauge #a2ad8d · blush #ffd9dc · wine #95042b
   Le fil conducteur visuel reste "le fil rouge" : une ligne verticale fixe
   qui se remplit avec le scroll. Elle est volontairement discrète
   (z-index modéré) pour cohabiter avec un menu sticky externe.

   ⚠️ NOTE POUR L'INTÉGRATION : si un menu sticky est ajouté après ce
   composant (ex. barre de navigation en bas de page), pensez à :
   - vérifier que son z-index est bien SUPÉRIEUR à 40 (celui du fil rouge),
   - garder le paddingBottom généreux du chapitre final pour éviter que
     le menu ne recouvre la dernière phrase.
   ========================================================================= */

const COLORS = {
  paper: "#F5F3EA",
  ink: "#2B1620",
  inkSoft: "#4A2F3B",
  sauge: "#a2ad8d",
  saugeD: "#6E7A5D",
  blush: "#ffd9dc",
  wine: "#95042b",
  cream: "#FBF0E9",
};

/* =========================================================================
   HOOKS
   ========================================================================= */

function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function usePageProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function handle() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollHeight = (doc.scrollHeight || 0) - window.innerHeight;
      setProgress(scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0);
    }
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);
  return progress;
}

/* =========================================================================
   PETITS COMPOSANTS PARTAGÉS
   ========================================================================= */

function DrawLine({ d, active, color = COLORS.wine, width = 3 }) {
  const pathRef = useRef(null);
  const [length, setLength] = useState(1);
  useEffect(() => {
    if (pathRef.current) {
      try {
        setLength(pathRef.current.getTotalLength());
      } catch (e) {}
    }
  }, [d]);
  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      style={{
        strokeDasharray: length,
        strokeDashoffset: active ? 0 : length,
        transition: "stroke-dashoffset .5s ease",
      }}
    />
  );
}

function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: "'Work Sans', sans-serif",
        fontSize: "0.74rem",
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: COLORS.wine,
        marginBottom: ".6rem",
      }}
    >
      {children}
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(22px)",
        transition: `opacity .8s ease ${delay}s, transform .8s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================================
   STYLES PARTAGÉS
   ========================================================================= */

const sectionStyle = {
  padding: "clamp(2.25rem, 6vw, 3.5rem) 1.5rem",
  position: "relative",
};

const narrowWrap = { maxWidth: 620, margin: "0 auto", textAlign: "center" };

const chapterTitleStyle = {
  fontFamily: "'Fraunces', serif",
  fontWeight: 600,
  fontSize: "clamp(1.6rem, 4vw, 2.3rem)",
  color: COLORS.ink,
  margin: "0 0 .6rem",
  lineHeight: 1.15,
};

const bodyTextStyle = {
  fontFamily: "'Work Sans', sans-serif",
  fontSize: "1rem",
  lineHeight: 1.65,
  color: COLORS.inkSoft,
};

const capStyle = {
  fontFamily: "'Work Sans', sans-serif",
  fontSize: ".82rem",
  color: COLORS.saugeD,
};

const primaryBtnStyle = {
  background: COLORS.wine,
  color: COLORS.cream,
  border: "none",
  borderRadius: 999,
  padding: ".6rem 1.4rem",
  fontFamily: "'Work Sans', sans-serif",
  fontWeight: 600,
  fontSize: ".88rem",
  cursor: "pointer",
  boxShadow: "0 8px 18px rgba(149,4,43,.25)",
};

const resetBtnStyle = {
  marginTop: ".9rem",
  background: "transparent",
  border: `1px solid ${COLORS.saugeD}`,
  color: COLORS.saugeD,
  borderRadius: 999,
  padding: ".35rem .9rem",
  fontFamily: "'Work Sans', sans-serif",
  fontSize: ".76rem",
  cursor: "pointer",
};

/* =========================================================================
   JEU 1 — Chapitre I : relier les chemins (rencontre)
   ========================================================================= */

const MEETING_POINTS = [
  { n: 1, x: 20, y: 130 },
  { n: 2, x: 70, y: 55 },
  { n: 3, x: 120, y: 110 },
  { n: 4, x: 175, y: 40 },
  { n: 5, x: 225, y: 95 },
  { n: 6, x: 270, y: 45 },
];

function MeetingPathsGame() {
  const [next, setNext] = useState(1);
  const [shake, setShake] = useState(null);
  const done = next > MEETING_POINTS.length;

  function handleClick(n) {
    if (n === next) {
      setNext(n + 1);
    } else {
      setShake(n);
      setTimeout(() => setShake((s) => (s === n ? null : s)), 350);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 290 160" style={{ width: "100%", maxWidth: 380, margin: "0 auto", display: "block" }}>
        {MEETING_POINTS.slice(0, -1).map((p, i) => {
          const q = MEETING_POINTS[i + 1];
          return <DrawLine key={i} d={`M${p.x},${p.y} L${q.x},${q.y}`} active={next > i + 1} />;
        })}
        {MEETING_POINTS.map((p) => {
          const connected = p.n < next || done;
          return (
            <g
              key={p.n}
              onClick={() => handleClick(p.n)}
              className={shake === p.n ? "dot-shake" : undefined}
              style={{ cursor: "pointer" }}
            >
              <circle cx={p.x} cy={p.y} r={14} fill={connected ? COLORS.wine : COLORS.paper} stroke={COLORS.wine} strokeWidth={2} />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                style={{
                  fontFamily: "'Work Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  fill: connected ? COLORS.cream : COLORS.wine,
                  pointerEvents: "none",
                }}
              >
                {p.n}
              </text>
            </g>
          );
        })}
      </svg>

      {done ? (
        <p style={{ ...bodyTextStyle, marginTop: ".75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          Et c'est ainsi que leurs chemins se sont croisés.
          <Heart size={16} color={COLORS.wine} fill={COLORS.wine} />
        </p>
      ) : (
        <p style={{ ...capStyle, marginTop: ".75rem" }}>Cliquez sur les points dans l'ordre, de 1 à {MEETING_POINTS.length}.</p>
      )}
      <button onClick={() => setNext(1)} style={resetBtnStyle}>
        ↺ Recommencer
      </button>
    </div>
  );
}

/* =========================================================================
   JEU 2 — Chapitre II : deviner la distance (slider "train")
   ========================================================================= */

function DistanceGame() {
  const ACTUAL = 235;
  const [guess, setGuess] = useState(150);
  const [revealed, setRevealed] = useState(false);
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  function updateFromX(clientX) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    let p = (clientX - rect.left) / rect.width;
    p = Math.min(1, Math.max(0, p));
    setGuess(Math.round((p * 400) / 5) * 5);
  }

  function onPointerDown(e) {
    draggingRef.current = true;
    updateFromX(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!draggingRef.current) return;
    updateFromX(e.clientX);
  }
  function onPointerUp() {
    draggingRef.current = false;
  }

  const pct = (guess / 400) * 100;
  const diff = Math.abs(guess - ACTUAL);
  let feedback = "Un peu loin... mais l'intention y est.";
  if (diff === 0) feedback = "Pile dans le mille ! 🎯";
  else if (diff <= 15) feedback = "Waouh, à quelques kilomètres près !";
  else if (diff <= 50) feedback = "Pas mal du tout !";

  return (
    <div style={{ textAlign: "center" }}>
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          position: "relative",
          height: 54,
          borderRadius: 27,
          background: `${COLORS.sauge}33`,
          cursor: "pointer",
          touchAction: "none",
          maxWidth: 400,
          margin: "1.25rem auto .75rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: "50%",
            height: 2,
            background: COLORS.saugeD,
            opacity: 0.5,
            transform: "translateY(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `calc(${pct}% - 21px)`,
            top: "50%",
            transform: "translateY(-50%)",
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: COLORS.wine,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: "0 6px 14px rgba(43,22,32,.3)",
          }}
        >
          🚂
        </div>
      </div>
      <p style={{ ...capStyle, marginBottom: ".9rem" }}>Ta réponse : {guess} km</p>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={primaryBtnStyle}>
          Valider ma réponse
        </button>
      ) : (
        <div>
          <p style={{ ...bodyTextStyle, marginBottom: ".2rem" }}>
            La vraie distance : <strong style={{ color: COLORS.wine }}>{ACTUAL} km</strong>
          </p>
          <p style={capStyle}>{feedback}</p>
          <button onClick={() => setRevealed(false)} style={resetBtnStyle}>
            ↺ Réessayer
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   JEU 3 — Chapitre III : charger le camion (déménagement en Normandie)
   ========================================================================= */

const MOVING_ITEMS = [
  { id: "lit", label: "Le lit", Icon: Bed },
  { id: "canape", label: "Le canapé", Icon: Armchair },
  { id: "lampe", label: "La lampe", Icon: Lamp },
  { id: "velo", label: "Le vélo", Icon: Bike },
  { id: "plante", label: "La plante", Icon: Flower2 },
  { id: "livres", label: "Les livres", Icon: BookOpen },
];

function PackingGame() {
  const [packed, setPacked] = useState([]);
  const allPacked = packed.length === MOVING_ITEMS.length;

  function toggle(id) {
    setPacked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ ...capStyle, marginBottom: ".5rem" }}>Cliquez sur les objets pour les charger dans le camion.</p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: ".5rem", marginBottom: "1.25rem" }}>
        {MOVING_ITEMS.map(({ id, label, Icon }) => {
          const isPacked = packed.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".4rem",
                padding: ".45rem .75rem",
                borderRadius: 999,
                border: `1.5px solid ${isPacked ? COLORS.wine : COLORS.saugeD}`,
                background: isPacked ? COLORS.wine : "transparent",
                color: isPacked ? COLORS.cream : COLORS.inkSoft,
                fontFamily: "'Work Sans', sans-serif",
                fontSize: ".8rem",
                fontWeight: 600,
                cursor: "pointer",
                opacity: isPacked ? 0.55 : 1,
                transition: "all .25s ease",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ position: "relative", maxWidth: 260, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div
            style={{
              width: 160,
              height: 92,
              background: COLORS.paper,
              border: `2.5px solid ${COLORS.saugeD}`,
              borderRadius: "8px 8px 0 0",
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              alignContent: "flex-start",
              gap: 4,
              padding: 8,
            }}
          >
            {MOVING_ITEMS.filter((it) => packed.includes(it.id)).map(({ id, Icon }) => (
              <Icon key={id} size={17} color={COLORS.wine} className="pack-pop" />
            ))}
          </div>
          <div style={{ width: 42, height: 56, background: COLORS.wine, borderRadius: "0 8px 4px 0", marginLeft: -2 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: -6 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: COLORS.ink }} />
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: COLORS.ink }} />
        </div>
      </div>

      <p style={{ ...capStyle, marginTop: ".9rem" }}>
        {packed.length} / {MOVING_ITEMS.length} chargés
      </p>
      {allPacked && (
        <p style={{ ...bodyTextStyle, color: COLORS.wine, fontWeight: 600, marginTop: ".4rem" }}>
          Camion prêt, direction la Normandie ! 🚚
        </p>
      )}
    </div>
  );
}

/* =========================================================================
   JEU 4 — Chapitre IV : retrouver les pays visités
   🔧 Personnalisez librement DESTINATIONS avec vos vrais voyages
   (visited: true/false, x/y en % de position sur la zone).
   ========================================================================= */

const DESTINATIONS = [
  { id: 1, name: "France", visited: true, x: 48, y: 58 },
  { id: 2, name: "Italie", visited: true, x: 60, y: 66 },
  { id: 3, name: "Portugal", visited: true, x: 34, y: 62 },
  { id: 4, name: "Grèce", visited: false, x: 66, y: 72 },
  { id: 5, name: "Islande", visited: true, x: 44, y: 16 },
  { id: 6, name: "Maroc", visited: false, x: 42, y: 82 },
  { id: 7, name: "Japon", visited: false, x: 92, y: 54 },
  { id: 8, name: "Norvège", visited: true, x: 56, y: 14 },
];

function TravelMapGame() {
  const totalVisited = DESTINATIONS.filter((d) => d.visited).length;
  const [found, setFound] = useState([]);
  const [hint, setHint] = useState(null);
  const complete = found.length === totalVisited;

  function handleClick(d) {
    if (d.visited) {
      setFound((f) => (f.includes(d.id) ? f : [...f, d.id]));
    } else {
      setHint(d.id);
      setTimeout(() => setHint((h) => (h === d.id ? null : h)), 900);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ ...capStyle, marginBottom: ".5rem" }}>Cliquez sur les points où ils sont déjà allés.</p>
      <div
        style={{
          position: "relative",
          maxWidth: 440,
          height: 230,
          margin: "0 auto 1rem",
          borderRadius: 20,
          overflow: "hidden",
          background: `radial-gradient(circle at 30% 20%, ${COLORS.blush}55, transparent 55%), radial-gradient(circle at 75% 70%, ${COLORS.sauge}55, transparent 55%), ${COLORS.paper}`,
          border: `1px dashed ${COLORS.saugeD}66`,
        }}
      >
        {DESTINATIONS.map((d) => {
          const isFound = found.includes(d.id);
          const isHint = hint === d.id;
          return (
            <button
              key={d.id}
              onClick={() => handleClick(d)}
              style={{
                position: "absolute",
                left: `${d.x}%`,
                top: `${d.y}%`,
                transform: "translate(-50%,-50%)",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: isFound ? 16 : 12,
                  height: isFound ? 16 : 12,
                  borderRadius: "50%",
                  display: "block",
                  background: isFound ? COLORS.wine : `${COLORS.saugeD}99`,
                  boxShadow: isFound ? `0 0 0 5px ${COLORS.wine}22` : "none",
                  transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
                }}
              />
              {(isFound || isHint) && (
                <span
                  style={{
                    marginTop: 4,
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize: ".66rem",
                    fontWeight: 700,
                    color: isFound ? COLORS.wine : COLORS.saugeD,
                    background: COLORS.paper,
                    padding: "1px 6px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isFound ? `${d.name} ✓` : "pas encore..."}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p style={capStyle}>
        {found.length} / {totalVisited} pays visités retrouvés
      </p>
      {complete && (
        <p
          style={{
            ...bodyTextStyle,
            color: COLORS.wine,
            fontWeight: 600,
            marginTop: ".4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          Tous les pays visités ont été retrouvés ! <Plane size={16} />
        </p>
      )}
    </div>
  );
}

/* =========================================================================
   JEU 5 — Chapitre V : retrouver les bêtises (notre fils à quatre pattes)
   🔧 Personnalisez librement MEFAITS avec vos vraies anecdotes.
   ========================================================================= */

const MEFAITS = [
  { id: 1, label: "Coussin éventré", emoji: "​🛋️", state : false },
  { id: 2, label: "Manger des Airpods", emoji: "🎧", state : true },
  { id: 3, label: "Croquer un mur", emoji: "​🧱​", state : false },
  { id: 5, label: "Faire pipi sur quelqu'un", emoji: "🐕", state : false },
  { id: 4, label: "Manger un passeport", emoji: "🛂", state : true },
  { id: 6, label: "Manger un passeport", emoji: "🛂", state : true },
];

function MischiefGame() {
  // Stocke les IDs trouvés : [1, 2]
  const [found, setFound] = useState([]);
  
  // Stocke le statut par ID : { 1: "fail", 2: "success" }
  const [statuses, setStatuses] = useState({});

  const complete = found.length === MEFAITS.length;

  function handleFind(item) {
    // Si déjà cliqué, on ne fait rien
    if (found.includes(item.id)) return;

    
    // 2. Mettre à jour le statut uniquement pour cet ID
    const result = item.state ? "success" : "fail";
    setStatuses((prev) => ({
      ...prev,
      [item.id]: result,
    }));
    // 1. Marquer comme trouvé
    if (item.state){
      setFound((prev) => [...prev, item.id]);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ ...capStyle, marginBottom: ".5rem" }}>Elément trouvé {found.length}/{MEFAITS.filter(item => item.state == true).length}</p>
      {MEFAITS.map((m) => {
        const isFound = found.includes(m.id);
        // Récupère le statut spécifique de ce bouton (ou "default" si pas encore cliqué)
        const itemStatus = statuses[m.id] || "default";

        return (
          <button
            key={m.id}
            onClick={() => handleFind(m)}
            className={`rounded m-3 p-1 btn-bad-${itemStatus}`}
          >
            <p>
              {m.emoji} {m.label}
            </p>
          </button>
        );
      })}
    </div>
  );
              {/* {isFound && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: 4,
                    background: COLORS.paper,
                    color: COLORS.wine,
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize: ".62rem",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 6px rgba(0,0,0,.15)",
                  }}
                >
                  {m.label}
                </div>
                </button>
              );
            })}
            )} */}
      {/* <p style={{ ...capStyle, marginBottom: ".5rem" }}>Il a fait {MEFAITS.length} bêtises dans la maison. Retrouvez-les toutes !</p>
      <div
        style={{
          position: "relative",
          maxWidth: 400,
          height: 210,
          margin: "0 auto 1rem",
          borderRadius: 20,
          background: `linear-gradient(180deg, ${COLORS.blush}44, ${COLORS.paper})`,
          border: `1px solid ${COLORS.saugeD}33`,
          overflow: "hidden",
        }}
      >
        {MEFAITS.map((m) => {
          const isFound = found.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => handleFind(m.id)}
              className={!isFound ? "pulse-dot" : undefined}
              style={{
                position: "absolute",
                left: `${m.x}%`,
                top: `${m.y}%`,
                transform: "translate(-50%,-50%)",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: isFound ? 26 : 22,
                filter: isFound ? "none" : "grayscale(1) opacity(.45)",
                transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
              }}
            >
              {m.emoji}
              {isFound && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: 4,
                    background: COLORS.paper,
                    color: COLORS.wine,
                    fontFamily: "'Work Sans', sans-serif",
                    fontSize: ".62rem",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 6px rgba(0,0,0,.15)",
                  }}
                >
                  {m.label}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p style={capStyle}>
        {found.length} / {MEFAITS.length} bêtises retrouvées
      </p>
      {complete && (
        <p
          style={{
            ...bodyTextStyle,
            color: COLORS.wine,
            fontWeight: 600,
            marginTop: ".4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          Toutes les bêtises retrouvées... et on l'aime quand même ! <PawPrint size={16} />
        </p>
  //     )} */}
  //   </div>
  // );
}

/* =========================================================================
   COMPOSANT PRINCIPAL
   ========================================================================= */

export default function HistoireCouple() {
  const pageProgress = usePageProgress();
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="hc-root" style={{ position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500;1,600&family=Work+Sans:wght@400;500;600;700&display=swap');

        .hc-root {
          font-family: 'Work Sans', sans-serif;
          color: ${COLORS.ink};
          background: ${COLORS.paper};
          overflow-x: hidden;
        }
        .hc-root em {
          font-style: italic;
          font-family: 'Fraunces', serif;
          color: ${COLORS.wine};
        }

        .thread-rail {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: rgba(162,173,141,0.25);
          z-index: 40; /* volontairement modéré, voir note en tête de fichier */
        }
        .thread-rail-fill {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background: ${COLORS.wine};
        }
        .thread-rail-marker {
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${COLORS.wine};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 4px ${COLORS.paper}, 0 2px 8px rgba(0,0,0,.25);
        }
        @media (max-width: 640px) {
          .thread-rail { width: 3px; }
          .thread-rail-marker { width: 13px; height: 13px; }
        }

        @keyframes bounceChevron {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(7px); }
        }
        .bounce-chevron { animation: bounceChevron 1.8s ease-in-out infinite; }

        @keyframes pulseHeart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        .pulse-heart { animation: pulseHeart 1.8s ease-in-out infinite; }

        @keyframes pulseDot {
          0%, 100% { opacity: .5; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.12); }
        }
        .pulse-dot { animation: pulseDot 1.5s ease-in-out infinite; }

        @keyframes dotShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .dot-shake { animation: dotShake .3s ease-in-out; transform-box: fill-box; transform-origin: center; }

        @keyframes packPop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .pack-pop { animation: packPop .3s cubic-bezier(.34,1.56,.64,1); }

        @keyframes ringFade {
          from { opacity: 0; transform: scale(.7); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      {/* ---- Fil rouge : rail de progression fixe (z-index modéré) ---- */}
      <div className="thread-rail">
        <div className="thread-rail-fill" style={{ height: `${pageProgress * 100}%` }} />
        <div className="thread-rail-marker" style={{ top: `${pageProgress * 100}%` }}>
          <Heart size={10} color={COLORS.paper} fill={COLORS.paper} />
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section
        style={{
          minHeight: "58vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: `radial-gradient(circle at 50% 30%, ${COLORS.blush}77, ${COLORS.paper} 62%)`,
          padding: "2.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 1s ease, transform 1s cubic-bezier(.16,1,.3,1)",
            maxWidth: 680,
          }}
        >
          <Eyebrow>L'histoire d'un couple</Eyebrow>
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: "clamp(2.2rem, 7vw, 4rem)",
              lineHeight: 1.08,
              color: COLORS.ink,
              margin: "0 0 1rem",
            }}
          >
            Deux villes,
            <br />
            <em>un seul fil</em>
          </h1>
          <p
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: COLORS.saugeD,
              maxWidth: 440,
              margin: "0 auto",
            }}
          >
            Le Nord. Paris. La Normandie. Une histoire à parcourir — et à jouer — jusqu'au bout.
          </p>
        </div>
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: ".35rem",
          }}
        >
          <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: ".7rem", letterSpacing: ".14em", textTransform: "uppercase", color: COLORS.saugeD }}>
            Faites défiler
          </span>
          <ChevronDown className="bounce-chevron" size={18} color={COLORS.wine} />
        </div>
      </section>

      {/* ================= CHAPITRE I — LA RENCONTRE ================= */}
      <section style={{ ...sectionStyle, background: COLORS.paper }}>
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre I — la rencontre</Eyebrow>
            <h2 style={chapterTitleStyle}>Deux chemins qui se croisent</h2>
            <p style={bodyTextStyle}>Rien ne les destinait à se rencontrer. Et pourtant, leurs chemins ont fini par se croiser.</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div style={{ marginTop: "1.25rem" }}>
            <MeetingPathsGame />
          </div>
        </Reveal>
      </section>

      {/* ================= CHAPITRE II — LA DISTANCE ================= */}
      <section style={{ ...sectionStyle, background: `${COLORS.sauge}22` }}>
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre II — la distance</Eyebrow>
            <h2 style={chapterTitleStyle}>Un week-end sur deux</h2>
            <p style={bodyTextStyle}>Le Nord d'un côté, Paris de l'autre. Seul le week-end les réunissait.</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div style={{ marginTop: "1.25rem" }}>
            <DistanceGame />
          </div>
        </Reveal>
      </section>

      {/* ================= CHAPITRE III — NOTRE CHEZ-NOUS ================= */}
      <section style={{ ...sectionStyle, background: COLORS.paper }}>
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre III — notre chez-nous</Eyebrow>
            <h2 style={chapterTitleStyle}>Direction la Normandie</h2>
            <p style={bodyTextStyle}>Les études terminées, plus besoin de compter les kilomètres. Direction un chez-eux, à eux deux.</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div style={{ marginTop: "1.25rem" }}>
            <PackingGame />
          </div>
        </Reveal>
      </section>

      {/* ================= CHAPITRE IV — LES VOYAGES ================= */}
      <section style={{ ...sectionStyle, background: `${COLORS.blush}33` }}>
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre IV — les voyages</Eyebrow>
            <h2 style={{ ...chapterTitleStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              Valises prêtes, direction ailleurs <Plane size={20} color={COLORS.wine} />
            </h2>
            <p style={bodyTextStyle}>Depuis, entre deux trains, ils ont surtout pris goût aux départs.</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div style={{ marginTop: "1.25rem" }}>
            <TravelMapGame />
          </div>
        </Reveal>
      </section>

      {/* ================= CHAPITRE V — NOTRE FILS ================= */}
      <section style={{ ...sectionStyle, background: COLORS.paper }}>
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre V — notre fils (à quatre pattes 🐾)</Eyebrow>
            <h2 style={{ ...chapterTitleStyle, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              Un compagnon plein de bêtises <Dog size={20} color={COLORS.wine} />
            </h2>
            <p style={bodyTextStyle}>Un jour, un petit compagnon à quatre pattes a rejoint l'aventure. Adorable... et un brin chapardeur.</p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div style={{ marginTop: "1.25rem" }}>
            <MischiefGame />
          </div>
        </Reveal>
      </section>

      {/* ================= CHAPITRE VI — S'UNIR POUR LA VIE (finale) ================= */}
      <section
        style={{
          ...sectionStyle,
          background: `linear-gradient(180deg, ${COLORS.paper}, ${COLORS.blush}44)`,
          paddingBottom: "clamp(5rem, 14vh, 7rem)", // espace réservé pour un éventuel menu sticky en bas de page
        }}
      >
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre VI — pour la vie</Eyebrow>
            <h2 style={chapterTitleStyle}>S'unir pour la vie</h2>

            <svg viewBox="0 0 100 50" style={{ width: 90, height: 45, margin: "1rem auto", display: "block", animation: "ringFade .9s ease" }}>
              <circle cx="38" cy="25" r="18" fill="none" stroke={COLORS.wine} strokeWidth="3" />
              <circle cx="62" cy="25" r="18" fill="none" stroke={COLORS.wine} strokeWidth="3" opacity="0.75" />
            </svg>

            <p style={bodyTextStyle}>Et aujourd'hui, ils choisissent de s'unir... pour la vie.</p>

            <div style={{ marginTop: "1.5rem" }}>
              <Heart className="pulse-heart" size={24} color={COLORS.wine} fill={COLORS.wine} />
              <p
                style={{
                  fontFamily: "'Work Sans', sans-serif",
                  fontSize: ".82rem",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  color: COLORS.saugeD,
                  marginTop: ".75rem",
                }}
              >
                Merci d'avoir suivi leur histoire
              </p>
            </div>
          </div>
        </Reveal>
      </section>
      <GlassNavBar index={1}/>
    </div>
  );
}