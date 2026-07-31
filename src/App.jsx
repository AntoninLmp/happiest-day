import { useState, useEffect } from 'react'
import './App.css'
import Letter from './components/Letter';
import Message from './components/Message';

const REVEAL_TOTAL_MS = 10000; // durée avant de passer à la page principale

function App() {
  const [stage, setStage] = useState('closed'); // 'closed' | 'message' | 'open'

  const envelopeOpen = stage !== 'closed';
  const messageVisible = stage === 'message';
  const pageVisible = stage === 'open';

  useEffect(() => {
    document.body.style.overflow = pageVisible ? 'auto' : 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [pageVisible])

  const handleOpenEnvelope = () => {
    if (stage !== 'closed') return;
    setStage('message');
    setTimeout(() => {
      setStage('open');
    }, REVEAL_TOTAL_MS);
  };

  return (
    <div className="app">
      <Letter isOpen={envelopeOpen} setIsOpen={handleOpenEnvelope} />

      <Message visible={messageVisible} />

      <main className={`page ${pageVisible ? "visible" : ""}`}>

        <section className="details-section">
          <article>
            <h2>Quand</h2>
            <p>Samedi 14 septembre 2026 à 16h</p>
          </article>
          <article>
            <h2>Où</h2>
            <p>Jardin des Lumières, Paris</p>
          </article>
          <article>
            <h2>Tenue</h2>
            <p>Pastel, brillant et festif</p>
          </article>
        </section>

        <section className="story-section">
          <h2>Merci d'être là</h2>
          <p>
            Nous avons hâte de partager ce moment unique avec vous, entourés de
            rires, de musique et de pensées colorées.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App