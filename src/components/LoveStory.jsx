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
  paper: "#fffdf9",
  ink: "#555b39",
  inkSoft: "#555b39",
  sauge: "#a2ad8d",
  saugeD: "#6E7A5D",
  blush: "#ffd9dc",
  wine: "#982229",
  cream: "#fffdf9",
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
        fontFamily: "'Instrument Serif', serif",
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
  fontFamily: "'Instrument Serif', serif",
  fontWeight: 400,
  fontSize: "clamp(1.6rem, 4vw, 2.3rem)",
  color: COLORS.ink,
  margin: "0 0 .6rem",
  lineHeight: 1.15,
};

const bodyTextStyle = {
  fontFamily: "'Instrument Serif', serif",
  fontSize: "1.1rem",
  lineHeight: 1.45,
  color: COLORS.inkSoft,
};

const capStyle = {
  fontFamily: "'Instrument Serif', serif",
  fontSize: ".82rem",
  color: COLORS.saugeD,
};

const primaryBtnStyle = {
  background: COLORS.wine,
  color: COLORS.cream,
  border: "none",
  borderRadius: 4,
  padding: ".6rem 1.4rem",
  fontFamily: "'Instrument Serif', serif",
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
  borderRadius: 4,
  padding: ".35rem .9rem",
  fontFamily: "'Instrument Serif', serif",
  fontSize: ".76rem",
  cursor: "pointer",
};

/* =========================================================================
   JEU 1 — Chapitre I : relier les chemins (rencontre)
   ========================================================================= */


const MAZE_COLS = 6;
const MAZE_ROWS = 5;
const MAZE_CELL = 46;
 
function generateMaze(cols, rows) {
  const cells = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ top: true, right: true, bottom: true, left: true }))
  );
  const seen = Array.from({ length: rows }, () => Array(cols).fill(false));
 
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
 
  function neighbors(r, c) {
    const list = [];
    if (r > 0) list.push([r - 1, c, "top", "bottom"]);
    if (r < rows - 1) list.push([r + 1, c, "bottom", "top"]);
    if (c > 0) list.push([r, c - 1, "left", "right"]);
    if (c < cols - 1) list.push([r, c + 1, "right", "left"]);
    return list;
  }
 
  // Parcours en profondeur itératif (pile) pour éviter tout souci de récursion
  const stack = [[0, 0]];
  seen[0][0] = true;
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const options = shuffle(neighbors(r, c)).filter(([nr, nc]) => !seen[nr][nc]);
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    const [nr, nc, wallHere, wallThere] = options[0];
    cells[r][c][wallHere] = false;
    cells[nr][nc][wallThere] = false;
    seen[nr][nc] = true;
    stack.push([nr, nc]);
  }
  return cells;
}
 
function getSvgPoint(svg, clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}
 
function MazeGame() {
  const [maze, setMaze] = useState(() => generateMaze(MAZE_COLS, MAZE_ROWS));
  const [path, setPath] = useState([[0, 0]]);
  const [solved, setSolved] = useState(false);
  const svgRef = useRef(null);
  const draggingRef = useRef(false);
 
  const endCell = [MAZE_ROWS - 1, MAZE_COLS - 1];
  const W = MAZE_COLS * MAZE_CELL;
  const H = MAZE_ROWS * MAZE_CELL;
 
  function cellFromEvent(e) {
    const { x, y } = getSvgPoint(svgRef.current, e.clientX, e.clientY);
    const c = Math.floor(x / MAZE_CELL);
    const r = Math.floor(y / MAZE_CELL);
    return { r, c };
  }
 
  function handlePointerDown(e) {
    if (solved) return;
    const { r, c } = cellFromEvent(e);
    if (r === 0 && c === 0) {
      draggingRef.current = true;
      setPath([[0, 0]]);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  }
 
  function handlePointerMove(e) {
    if (!draggingRef.current || solved) return;
    const { r, c } = cellFromEvent(e);
    if (r < 0 || r >= MAZE_ROWS || c < 0 || c >= MAZE_COLS) return;
 
    setPath((prev) => {
      const [lr, lc] = prev[prev.length - 1];
      if (lr === r && lc === c) return prev;
 
      if (prev.length > 1) {
        const [pr, pc] = prev[prev.length - 2];
        if (pr === r && pc === c) return prev.slice(0, -1);
      }
 
      const dr = r - lr;
      const dc = c - lc;
      if (Math.abs(dr) + Math.abs(dc) !== 1) return prev;
 
      const cell = maze[lr][lc];
      let open = false;
      if (dr === -1 && !cell.top) open = true;
      if (dr === 1 && !cell.bottom) open = true;
      if (dc === -1 && !cell.left) open = true;
      if (dc === 1 && !cell.right) open = true;
      if (!open) return prev;
 
      if (prev.some(([pr, pc]) => pr === r && pc === c)) return prev;
 
      const next = [...prev, [r, c]];
      if (r === endCell[0] && c === endCell[1]) setSolved(true);
      return next;
    });
  }
 
  function handlePointerUp() {
    draggingRef.current = false;
    setPath((prev) => {
      const [lr, lc] = prev[prev.length - 1];
      if (lr === endCell[0] && lc === endCell[1]) return prev;
      return [[0, 0]];
    });
  }
 
  function handleReset() {
    setMaze(generateMaze(MAZE_COLS, MAZE_ROWS));
    setPath([[0, 0]]);
    setSolved(false);
  }
 
  const center = ([r, c]) => [c * MAZE_CELL + MAZE_CELL / 2, r * MAZE_CELL + MAZE_CELL / 2];
 
  return (
    <div style={{ textAlign: "center" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", maxWidth: 320, margin: "0 auto", display: "block", touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <rect x={0} y={0} width={W} height={H} fill={COLORS.paper} />
 
        {/* chemin tracé */}
        {path.length > 1 && (
          <polyline
            points={path.map((cell) => center(cell).join(",")).join(" ")}
            fill="none"
            stroke={COLORS.wine}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.85}
          />
        )}
 
        {/* murs du labyrinthe */}
        {maze.map((row, r) =>
          row.map((cell, c) => {
            const x0 = c * MAZE_CELL;
            const y0 = r * MAZE_CELL;
            const x1 = x0 + MAZE_CELL;
            const y1 = y0 + MAZE_CELL;
            const segs = [];
            if (cell.top) segs.push(`M${x0},${y0} L${x1},${y0}`);
            if (cell.left) segs.push(`M${x0},${y0} L${x0},${y1}`);
            if (r === MAZE_ROWS - 1 && cell.bottom) segs.push(`M${x0},${y1} L${x1},${y1}`);
            if (c === MAZE_COLS - 1 && cell.right) segs.push(`M${x1},${y0} L${x1},${y1}`);
            return segs.map((d, i) => (
              <path key={`${r}-${c}-${i}`} d={d} stroke={COLORS.saugeD} strokeWidth={3} strokeLinecap="round" />
            ));
          })
        )}
 
        {/* départ */}
        <circle cx={center([0, 0])[0]} cy={center([0, 0])[1]} r={13} fill={COLORS.wine} />
        {/* arrivée */}
        <circle cx={center(endCell)[0]} cy={center(endCell)[1]} r={13} fill={solved ? COLORS.wine : COLORS.sauge} style={{ transition: "fill .3s ease" }} />
      </svg>
 
      {solved ? (
        <p style={{ ...bodyTextStyle, marginTop: ".75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          Et c'est ainsi que leurs chemins se sont croisés.
          <Heart size={16} color={COLORS.wine} fill={COLORS.wine} className="pulse-heart" />
        </p>
      ) : (
        <p style={{ ...capStyle, marginTop: ".75rem" }}>
          Partez du point rose, glissez le doigt (ou la souris) dans le labyrinthe jusqu'au point vert, sans lever le trait.
        </p>
      )}
      <button onClick={handleReset} style={resetBtnStyle}>
        ↺ {solved ? "Recommencer" : "Nouveau labyrinthe"}
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
      <p style={{ ...capStyle, marginBottom: ".5rem" }}>Devinez la distance qu'ils devaient parcourir:</p>
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
        .hc-root {
          color: ${COLORS.ink};
          background: ${COLORS.paper};
        }
        .hc-root section {
          font-family: 'Instrument Serif', serif;
        }
        .hc-root em {
          font-style: italic;
          font-family: 'Instrument Serif', serif;
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
        <div
          className="thread-rail-fill"
          style={{ height: `${pageProgress * 100}%` }}
        />
        <div
          className="thread-rail-marker"
          style={{ top: `${pageProgress * 100}%` }}
        >
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
            transition:
              "opacity 1s ease, transform 1s cubic-bezier(.16,1,.3,1)",
            maxWidth: 680,
          }}
        >
          <Eyebrow>L'histoire d'Elisa & Antonin</Eyebrow>
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontWeight: 400,
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
              fontFamily: "'Instrument Serif', serif",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: COLORS.saugeD,
              maxWidth: 440,
              margin: "0 auto",
            }}
          >
            Bully-le-mines. Paris. La Normandie. <br /> Une histoire qui voyage.
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
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: ".7rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: COLORS.saugeD,
            }}
          >
            Faites défiler
          </span>
          <ChevronDown
            className="bounce-chevron"
            size={18}
            color={COLORS.wine}
          />
        </div>
      </section>

      {/* ================= CHAPITRE I — LA RENCONTRE ================= */}
      <section style={{ ...sectionStyle, background: COLORS.paper }}>
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre I — la rencontre</Eyebrow>
            <h2 style={chapterTitleStyle}>Deux chemins qui se croisent</h2>
            <p style={bodyTextStyle}>
              Lors de l’anniversaire du frère d’Antonin, leurs chemins se
              croisent pour la première fois. Un regard, un feeling… et
              rapidement, l’envie de ne plus se quitter. Sur un coup de tête,
              ils décident même de partir en vacances ensemble, pour apprendre à
              se connaître et voir où cette histoire les mènerait.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div style={{ marginTop: "1.25rem" }}>
            <MazeGame />
          </div>
        </Reveal>
      </section>

      {/* ================= CHAPITRE II — LA DISTANCE ================= */}
      <section style={{ ...sectionStyle, background: `${COLORS.sauge}22` }}>
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre II — la distance</Eyebrow>
            <h2 style={chapterTitleStyle}>Un week-end sur deux</h2>
            <p style={bodyTextStyle}>
              Pendant deux ans, leur histoire s’écrit entre Arras et Paris, au
              rythme des allers-retours en train. Un week-end sur deux, le même
              rituel : Vendredi soir : valise prête, direction la gare… pour les
              retrouvailles. Dimanche soir : valise prête, direction la gare…
              pour les au revoirs. Des kilomètres parcourus, des heures dans les
              trains, des week-ends trop courts… la SNCF devrait nous remercier.
            </p>
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
            <p style={bodyTextStyle}>
              Puis vient le moment où les études se terminent. Plus besoin de
              compter les kilomètres. Plus besoin de regarder le calendrier pour
              savoir quand aura lieu la prochaine retrouvaille. Direction la
              Normandie, pour construire quelque chose de nouveau : un chez-eux,
              à eux deux.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ================= CHAPITRE IV — LES VOYAGES ================= */}
      <section style={{ ...sectionStyle, background: `${COLORS.blush}33` }}>
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre IV — les voyages</Eyebrow>
            <h2
              style={{
                ...chapterTitleStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Valises prêtes, direction ailleurs{" "}
              <Plane size={20} color={COLORS.wine} />
            </h2>
            <p style={bodyTextStyle}>
              Les valises, elles, n’ont jamais vraiment eu le temps de prendre
              la poussière. Après les kilomètres parcourus en train, l’envie de
              partir à deux ne les a jamais quittés. Alors, dès qu’une occasion
              se présente, ils partent découvrir de nouveaux horizons, de
              nouvelles cultures et de nouveaux paysages à travers le monde.
              Parce que pour eux, le plus important n’a jamais été la
              destination, mais tout ce qu’ils vivent ensemble sur le chemin.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ================= CHAPITRE V — NOTRE FILS ================= */}
      <section style={{ ...sectionStyle, background: COLORS.paper }}>
        <Reveal>
          <div style={narrowWrap}>
            <Eyebrow>Chapitre V — notre fils (à quatre pattes 🐾)</Eyebrow>
            <h2
              style={{
                ...chapterTitleStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Un compagnon plein de bêtises{" "}
              <Dog size={20} color={COLORS.wine} />
            </h2>
            <p style={bodyTextStyle}>
              Et puis, un jour, un nouveau compagnon à quatre pattes rejoint
              l’aventure. Un fils adorable… …qui sait aussi se transformer en
              véritable petit démon quand l’envie lui prend. 🐾 Depuis, il
              partage leur quotidien… et y ajoute quelques bêtises. Parce qu’une
              famille, ça se construit aussi avec des poils sur le canapé, des
              jouets qui traînent et beaucoup, beaucoup d’amour.
            </p>
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

            <svg
              viewBox="0 0 100 50"
              style={{
                width: 90,
                height: 45,
                margin: "1rem auto",
                display: "block",
                animation: "ringFade .9s ease",
              }}
            >
              <circle
                cx="38"
                cy="25"
                r="18"
                fill="none"
                stroke={COLORS.wine}
                strokeWidth="3"
              />
              <circle
                cx="62"
                cy="25"
                r="18"
                fill="none"
                stroke={COLORS.wine}
                strokeWidth="3"
                opacity="0.75"
              />
            </svg>

            <p style={bodyTextStyle}>
              Après toutes ces aventures et ces moments de bonheur partagés.
              Elisa et Antonin continuent l’aventure et decident de s’unir pour
              la vie. Si vous lisez ces quelques mots c’est que vous faites
              partie de l’aventure pour partager ce jour si important : Leur
              mariage. <br />
              Bien d'autres chapitres les attendent...
            </p>

            <div style={{ marginTop: "1.5rem" }}>
              <Heart
                className="pulse-heart"
                size={24}
                color={COLORS.wine}
                fill={COLORS.wine}
              />
              <p
                style={{
                  fontFamily: "'Instrument Serif', serif",
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
      <GlassNavBar index={1} />
    </div>
  );
}