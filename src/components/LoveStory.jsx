import React, { useEffect, useRef, useState } from "react";
import { Heart, ChevronDown } from "lucide-react";

/* =========================================================================
   TOKENS
   Palette imposée : sauge #a2ad8d · blush #ffd9dc · wine #95042b
   Le fil conducteur visuel de la page est littéralement "le fil rouge" :
   une ligne verticale fixe (couleur wine) qui se remplit avec le scroll,
   et qui change de forme à chaque chapitre (ligne pointillée sur la carte,
   caténaire au-dessus du train, pliure du ticket, puis nœud final).
   ========================================================================= */

const COLORS = {
  paper: "#F5F3EA",
  ink: "#2B1620",
  inkSoft: "#4A2F3B",
  sauge: "#a2ad8d",
  saugeD: "#6E7A5D",
  blush: "#ffd9dc",
  wine: "#95042b",
  night: "#26121A",
  cream: "#FBF0E9",
};

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 53.7) % 100,
  y: (i * 29.3) % 100,
  r: 0.6 + ((i * 17) % 10) / 10,
  delay: (i % 10) / 2,
}));

/* =========================================================================
   HOOKS
   ========================================================================= */

function useInView(threshold = 0.3) {
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

function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function handle() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = -rect.top;
      setProgress(Math.min(1, Math.max(0, scrolled / total)));
    }
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, [ref]);
  return progress;
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

function useCountUp(target, active, duration = 1700) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => raf && cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return count;
}

/* =========================================================================
   PETITS COMPOSANTS
   ========================================================================= */

function DrawLine({ d, active, color = COLORS.wine, width = 3, delay = 0 }) {
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
        transition: `stroke-dashoffset 1.7s cubic-bezier(.4,0,.2,1) ${delay}s`,
      }}
    />
  );
}

function Eyebrow({ children, dark }) {
  return (
    <div
      style={{
        fontFamily: "'Work Sans', sans-serif",
        fontSize: "0.76rem",
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: dark ? COLORS.blush : COLORS.wine,
        marginBottom: "1rem",
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
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .9s ease ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function TrainSVG() {
  const litWindow = 2;
  const windows = [34, 58, 82, 106, 130, 154];
  return (
    <svg
      viewBox="0 0 240 90"
      width="220"
      height="82"
      style={{ display: "block", filter: "drop-shadow(0 10px 18px rgba(0,0,0,.4))" }}
    >
      <path
        d="M8,60 L8,38 Q8,22 26,22 L168,22 Q198,22 212,46 L220,58 Q220,68 208,68 L14,68 Q8,68 8,60 Z"
        fill={COLORS.wine}
        stroke={COLORS.ink}
        strokeWidth="1.5"
      />
      {windows.map((x, i) => (
        <rect
          key={i}
          x={x}
          y={32}
          width={16}
          height={16}
          rx={3}
          fill={i === litWindow ? COLORS.blush : "#1b0d13"}
          style={i === litWindow ? { filter: `drop-shadow(0 0 6px ${COLORS.blush})` } : undefined}
        />
      ))}
      <rect x="6" y="66" width="214" height="4" rx="2" fill={COLORS.ink} opacity="0.5" />
      <path d="M110,22 L110,10 L136,10 L136,4" fill="none" stroke={COLORS.ink} strokeWidth="2" />
    </svg>
  );
}

function Tree({ left, scale = 1, delay = 0, inView }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left,
        transformOrigin: "bottom center",
        transform: `scale(${inView ? scale : 0.3})`,
        opacity: inView ? 1 : 0,
        transition: `transform .8s cubic-bezier(.34,1.56,.64,1) ${delay}s, opacity .6s ease ${delay}s`,
      }}
    >
      <div style={{ width: 10, height: 36, background: COLORS.saugeD, margin: "0 auto" }} />
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: COLORS.sauge,
          marginTop: -46,
          position: "relative",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="blossom"
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: COLORS.blush,
              top: `${10 + i * 12}%`,
              left: `${14 + i * 18}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   STYLES
   ========================================================================= */

const heroSectionStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  background: `radial-gradient(circle at 50% 30%, ${COLORS.blush}77, ${COLORS.paper} 62%)`,
  padding: "2rem",
  textAlign: "center",
};

const heroTitleStyle = {
  fontFamily: "'Fraunces', Georgia, serif",
  fontWeight: 600,
  fontSize: "clamp(2.6rem, 8vw, 5.2rem)",
  lineHeight: 1.05,
  color: COLORS.ink,
  margin: "0 0 1.25rem",
};

const heroSubStyle = {
  fontFamily: "'Work Sans', sans-serif",
  fontSize: "1.05rem",
  lineHeight: 1.6,
  color: COLORS.saugeD,
  maxWidth: 460,
  margin: "0 auto",
};

const chapterSectionStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "clamp(3rem, 8vw, 5rem) 1.5rem",
  position: "relative",
};

const chapterTitleStyle = {
  fontFamily: "'Fraunces', serif",
  fontWeight: 600,
  fontSize: "clamp(2rem, 5vw, 3rem)",
  color: COLORS.ink,
  margin: "0 0 1rem",
  lineHeight: 1.1,
};

const bodyTextStyle = {
  fontFamily: "'Work Sans', sans-serif",
  fontSize: "1.05rem",
  lineHeight: 1.7,
  color: COLORS.inkSoft,
};

const pinLabelStyle = {
  fontFamily: "'Work Sans', sans-serif",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1,
  fill: COLORS.ink,
};

const mapCaptionStyle = {
  textAlign: "center",
  marginTop: ".75rem",
  fontFamily: "'Fraunces', serif",
  fontStyle: "italic",
  fontSize: ".95rem",
  color: COLORS.saugeD,
};

const stageTextStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  fontFamily: "'Work Sans', sans-serif",
  fontSize: "1.15rem",
  lineHeight: 1.6,
  color: COLORS.cream,
  transition: "opacity .3s linear",
};

const ticketWrapStyle = {
  maxWidth: 360,
  margin: "2.5rem auto 0",
  background: "#FFFFFF",
  borderRadius: 16,
  padding: "1.5rem 1.25rem",
  boxShadow: "0 16px 34px rgba(43,22,32,.14)",
};

const weekHeaderRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(7,1fr)",
  gap: 6,
  marginBottom: 8,
};

const dayLabelStyle = {
  textAlign: "center",
  fontSize: ".7rem",
  fontWeight: 700,
  letterSpacing: ".04em",
  color: COLORS.saugeD,
  fontFamily: "'Work Sans', sans-serif",
};

const weekRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(7,1fr)",
  gap: 6,
  marginBottom: 6,
};

const daySquareStyle = {
  aspectRatio: "1",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const counterNumberStyle = {
  fontFamily: "'Fraunces', serif",
  fontWeight: 600,
  fontStyle: "italic",
  fontSize: "3rem",
  color: COLORS.wine,
  lineHeight: 1,
};

const counterLabelStyle = {
  fontFamily: "'Work Sans', sans-serif",
  fontSize: ".78rem",
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: COLORS.saugeD,
  marginTop: 4,
};

/* =========================================================================
   COMPOSANT PRINCIPAL
   ========================================================================= */

export default function LoveStory() {
  const pageProgress = usePageProgress();
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  const [mapRef, mapInView] = useInView(0.35);
  const trainSectionRef = useRef(null);
  const trainProgress = useScrollProgress(trainSectionRef);
  const [weekendRef, weekendInView] = useInView(0.3);
  const weekendCount = useCountUp(104, weekendInView, 1800);
  const [normRef, normInView] = useInView(0.3);

  const stageOpacity = (p, center, w = 0.26) => {
    const d = Math.abs(p - center);
    return Math.max(0, 1 - d / w);
  };

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

        .two-col-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          max-width: 1000px;
          margin: 0 auto;
          align-items: center;
          width: 100%;
        }
        @media (min-width: 800px) {
          .two-col-grid { grid-template-columns: 1.1fr 0.9fr; gap: 3rem; }
        }

        .thread-rail {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          background: rgba(162,173,141,0.25);
          z-index: 999;
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
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${COLORS.wine};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 4px ${COLORS.paper}, 0 2px 8px rgba(0,0,0,.25);
        }
        @media (max-width: 640px) {
          .thread-rail { width: 3px; }
          .thread-rail-marker { width: 14px; height: 14px; }
        }

        @keyframes bounceChevron {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .bounce-chevron { animation: bounceChevron 1.8s ease-in-out infinite; }

        @keyframes twinkle {
          0%, 100% { opacity: .25; }
          50% { opacity: 1; }
        }
        .star { animation: twinkle 3s ease-in-out infinite; }

        @keyframes floatHeart {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.1); }
        }

        @keyframes blossomFloat {
          0%, 100% { transform: translateY(0); opacity: .85; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        .blossom { animation: blossomFloat 2.6s ease-in-out infinite; }

        @keyframes pulseHeart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        .pulse-heart { animation: pulseHeart 1.8s ease-in-out infinite; }

        @keyframes pulseDot {
          0%, 100% { opacity: .5; }
          50% { opacity: 1; }
        }
        .pulse-dot { animation: pulseDot 1.6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      {/* ---- Fil rouge : rail de progression fixe ---- */}
      <div className="thread-rail">
        <div className="thread-rail-fill" style={{ height: `${pageProgress * 100}%` }} />
        <div className="thread-rail-marker" style={{ top: `${pageProgress * 100}%` }}>
          <Heart size={11} color={COLORS.paper} fill={COLORS.paper} />
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section style={heroSectionStyle}>
        <div
          style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1.1s ease, transform 1.1s cubic-bezier(.16,1,.3,1)",
            maxWidth: 720,
          }}
        >
          <Eyebrow>L'histoire d'un couple</Eyebrow>
          <h1 style={heroTitleStyle}>
            Deux villes,
            <br />
            <em>un seul fil</em>
          </h1>
          <p style={heroSubStyle}>
            Le Nord. Paris. La Normandie.
            <br />
            Une histoire tissée à coups de trains et de week-ends.
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "2.2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: ".4rem",
          }}
        >
          <span
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontSize: ".72rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: COLORS.saugeD,
            }}
          >
            Faites défiler
          </span>
          <ChevronDown className="bounce-chevron" size={20} color={COLORS.wine} />
        </div>
      </section>

      {/* ================= CHAPITRE I — LA DISTANCE ================= */}
      <section style={{ ...chapterSectionStyle, background: COLORS.paper }}>
        <div className="two-col-grid">
          <Reveal>
            <div>
              <Eyebrow>Chapitre I — environ 220 km</Eyebrow>
              <h2 style={chapterTitleStyle}>Loin l'un de l'autre</h2>
              <p style={bodyTextStyle}>
                Tout commence à deux bouts de la carte. L'un dans le Nord, l'autre à Paris — deux
                quotidiens, deux villes, et pourtant, quelque chose qui commence déjà à les relier.
              </p>
            </div>
          </Reveal>

          <div ref={mapRef} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox="0 0 300 300" style={{ width: "100%", height: "auto", maxWidth: 340 }}>
              <polygon
                points="150,15 245,65 260,185 165,275 55,250 25,105"
                fill="none"
                stroke={COLORS.sauge}
                strokeWidth="2"
                strokeDasharray="5 7"
                opacity="0.6"
              />
              <DrawLine d="M178,55 L150,135" active={mapInView} />
              <circle
                cx="164"
                cy="95"
                r={mapInView ? 4 : 0}
                fill={COLORS.wine}
                className="pulse-dot"
                style={{ transition: "r .4s ease .9s" }}
              />
              <g style={{ opacity: mapInView ? 1 : 0, transition: "opacity .6s ease .2s" }}>
                <circle cx="178" cy="55" r="6" fill={COLORS.wine} />
                <text x="178" y="40" textAnchor="middle" style={pinLabelStyle}>
                  NORD
                </text>
              </g>
              <g style={{ opacity: mapInView ? 1 : 0, transition: "opacity .6s ease .9s" }}>
                <circle cx="150" cy="135" r="6" fill={COLORS.wine} />
                <text x="150" y="156" textAnchor="middle" style={pinLabelStyle}>
                  PARIS
                </text>
              </g>
            </svg>
            <div style={mapCaptionStyle}>L'Hexagone, vu depuis leur histoire.</div>
          </div>
        </div>
      </section>

      {/* ================= CHAPITRE II — LE TRAIN (sticky) ================= */}
      <div ref={trainSectionRef} style={{ position: "relative", height: "100vh", background: COLORS.night }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            {STARS.map((s, i) => (
              <div
                key={i}
                className="star"
                style={{
                  position: "absolute",
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.r * 2,
                  height: s.r * 2,
                  borderRadius: "50%",
                  background: COLORS.cream,
                  animationDelay: `${s.delay}s`,
                }}
              />
            ))}
          </div>

          {/* caténaire = le fil, version "ligne électrique" */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "32%",
              height: 2,
              background: `repeating-linear-gradient(90deg, ${COLORS.wine} 0 70px, transparent 70px 74px)`,
              opacity: 0.65,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "36%",
              left: 0,
              width: 240,
              transform: `translateX(${-40 + trainProgress * 180}vw)`,
              willChange: "transform",
            }}
          >
            <TrainSVG />
          </div>

          <div
            style={{
              position: "relative",
              textAlign: "center",
              padding: "0 1.5rem",
              maxWidth: 640,
              margin: "0 auto",
              zIndex: 2,
            }}
          >
            <Eyebrow dark>Chapitre II — le trajet</Eyebrow>
            <h2 style={{ ...chapterTitleStyle, color: COLORS.cream }}>Le même train, chaque semaine</h2>
            <div style={{ position: "relative", height: 100, marginTop: "1.5rem" }}>
              <p style={{ ...stageTextStyle, opacity: stageOpacity(trainProgress, 0.17) }}>
                Vendredi soir. Sac sur l'épaule, direction l'autre bout de la ligne.
              </p>
              <p style={{ ...stageTextStyle, opacity: stageOpacity(trainProgress, 0.5) }}>
                Quelques heures de trajet, la tête déjà pleine de retrouvailles.
              </p>
              <p style={{ ...stageTextStyle, opacity: stageOpacity(trainProgress, 0.83) }}>
                Dimanche soir, le train repart dans l'autre sens — jusqu'à la semaine suivante.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CHAPITRE III — 2 ANS DE WEEK-ENDS ================= */}
      <section ref={weekendRef} style={{ ...chapterSectionStyle, background: COLORS.blush }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <Eyebrow>Chapitre III — 2 ans à distance</Eyebrow>
            <h2 style={chapterTitleStyle}>Se retrouver, seulement le week-end</h2>
            <p style={bodyTextStyle}>
              Deux ans durant, leur histoire tient dans deux jours sur sept. Vendredi, les
              retrouvailles. Dimanche, déjà l'au revoir.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div style={ticketWrapStyle}>
            <div style={weekHeaderRowStyle}>
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <span key={i} style={dayLabelStyle}>
                  {d}
                </span>
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, row) => (
              <div key={row} style={weekRowStyle}>
                {Array.from({ length: 7 }).map((_, col) => {
                  const weekend = col >= 5;
                  return (
                    <div
                      key={col}
                      style={{
                        ...daySquareStyle,
                        background: weekend ? COLORS.wine : `${COLORS.sauge}33`,
                      }}
                    >
                      {weekend && <Heart size={10} color={COLORS.blush} fill={COLORS.blush} />}
                    </div>
                  );
                })}
              </div>
            ))}
            <div
              style={{
                textAlign: "center",
                color: COLORS.saugeD,
                letterSpacing: ".1em",
                fontSize: ".8rem",
                margin: ".5rem 0 1.25rem",
              }}
            >
              · · ·
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={counterNumberStyle}>{weekendCount}</div>
              <div style={counterLabelStyle}>week-ends de retrouvailles, en deux ans</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= CHAPITRE IV — LA NORMANDIE ================= */}
      <section
        ref={normRef}
        style={{ ...chapterSectionStyle, background: `linear-gradient(180deg, ${COLORS.paper}, ${COLORS.sauge}55)` }}
      >
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
            <Eyebrow>Chapitre IV — le tournant</Eyebrow>
            <h2 style={chapterTitleStyle}>Direction la Normandie</h2>
            <p style={bodyTextStyle}>
              Les études terminées, plus besoin de compter les kilomètres ni les jours. Ils ont
              choisi un seul point sur la carte — un chez-eux, entre pommiers et bord de mer.
            </p>
          </div>
        </Reveal>

        <div style={{ position: "relative", height: 240, marginTop: "2rem" }}>
          <div style={{ position: "relative", width: 280, height: 220, margin: "0 auto" }}>
            <Tree left={10} scale={0.85} delay={0.5} inView={normInView} />
            <Tree left={210} scale={0.95} delay={0.7} inView={normInView} />

            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                transform: `translateX(-50%) scale(${normInView ? 1 : 0.5})`,
                opacity: normInView ? 1 : 0,
                transition:
                  "transform .9s cubic-bezier(.34,1.56,.64,1) .3s, opacity .6s ease .3s",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  margin: "0 auto",
                  borderLeft: "46px solid transparent",
                  borderRight: "46px solid transparent",
                  borderBottom: `54px solid ${COLORS.wine}`,
                }}
              />
              <div
                style={{
                  width: 120,
                  height: 80,
                  background: COLORS.paper,
                  border: `2px solid ${COLORS.saugeD}`,
                  borderTop: "none",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    width: 26,
                    height: 26,
                    borderRadius: 4,
                    background: COLORS.blush,
                    boxShadow: `0 0 14px ${COLORS.blush}`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 20,
                    width: 26,
                    height: 44,
                    background: COLORS.saugeD,
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: -70,
                  right: 18,
                  width: 10,
                  height: 26,
                  background: COLORS.saugeD,
                }}
              />
              <Heart
                size={14}
                color={COLORS.blush}
                fill={COLORS.blush}
                style={{
                  position: "absolute",
                  top: -92,
                  right: 14,
                  animation: normInView ? "floatHeart 3s ease-in-out infinite" : "none",
                }}
              />
            </div>
          </div>
        </div>

        <Reveal delay={0.9}>
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontSize: "1.2rem",
              color: COLORS.wine,
            }}
          >
            Chez eux, enfin.
          </div>
        </Reveal>
      </section>

      {/* ================= FIN ================= */}
      <section style={{ ...chapterSectionStyle, minHeight: "50vh", background: COLORS.paper }}>
        <Reveal>
          <div style={{ textAlign: "center" }}>
            <Heart className="pulse-heart" size={28} color={COLORS.wine} fill={COLORS.wine} />
            <p
              style={{
                fontFamily: "'Fraunces', serif",
                fontStyle: "italic",
                fontSize: "1.6rem",
                color: COLORS.ink,
                margin: "1rem 0 .5rem",
              }}
            >
              Et depuis... plus jamais un aller sans retour.
            </p>
            <p
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: ".85rem",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: COLORS.saugeD,
              }}
            >
              Fin — ou plutôt, le début.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}