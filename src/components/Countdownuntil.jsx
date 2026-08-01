import { useState, useEffect } from 'react';

const WEDDING_DATE = new Date('2026-09-14T16:00:00');

function getTimeLeft() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isPast: false };
}

function CountdownUntil() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft.isPast) {
    return (
      <section className="countdown-section">
        <h2>C'est aujourd'hui (ou déjà passé) !</h2>
      </section>
    );
  }
  return (
    <section className="countdown-section">
      <h2>Compte à rebours</h2>
      <div className="countdown-row">
        <div className="countdown-unit">
          <span className="countdown-number">{timeLeft.days}</span>
          <span className="countdown-label">Jours</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-number">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="countdown-label">Heures</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-number">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-number">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="countdown-label">Secondes</span>
        </div>
      </div>
    </section>
  );
}

export default CountdownUntil;
