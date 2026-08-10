import { useRef, useEffect, useState, useCallback } from 'react';

const RADIUS = 40; // rayon du rond en px
const BRUSH_SIZE = 10; // rayon du pinceau en px
const REVEAL_THRESHOLD = 0.55; // % de surface grattée avant de considérer "révélé"

function ScratchCircle({ label, value }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const size = RADIUS * 2;

  const drawCover = useCallback((ctx) => {
    ctx.clearRect(0, 0, size, size);

    // Couche à gratter
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#c9a97e';
    ctx.beginPath();
    ctx.arc(RADIUS, RADIUS, RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Petit texte indicatif "GRATTEZ"
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GRATTEZ', RADIUS, RADIUS);
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    drawCover(ctx);
  }, [drawCover, size]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const scratchAt = (x, y) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_SIZE, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkRevealPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { data } = ctx.getImageData(0, 0, size, size);
    let transparent = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4) {
      // On ne compte que les pixels dans le cercle (approximation via alpha du fond)
      total++;
      if (data[i] === 0) transparent++;
    }
    if (transparent / total > REVEAL_THRESHOLD) {
      setRevealed(true);
    }
  };

  const handleStart = (e) => {
    isDrawing.current = true;
    const { x, y } = getPos(e);
    scratchAt(x, y);
  };

  const handleMove = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    scratchAt(x, y);
  };

  const handleEnd = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    checkRevealPercentage();
  };

  return (
    <div className="scratch-circle" style={{ width: size, height: size }}>
      <div className="scratch-value c-green2">
        <span>{value}</span>
      </div>
      <canvas
        ref={canvasRef}
        className={`scratch-canvas ${revealed ? 'revealed' : ''}`}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
      <p className="scratch-label c-green2">{label}</p>
    </div>
  );
}

export default ScratchCircle;