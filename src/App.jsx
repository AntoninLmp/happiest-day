import { useState, useEffect } from 'react'
import './App.css'
import Letter from './components/Letter';


function App() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'auto' : 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <div className="app">
      <Letter isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className={`page ${isOpen ? "visible" : ""}`}>
        <section className="hero-section">
          <div className="hero-content">
            <p className="pretitle">Le plus beau jour</p>
            <h1>Notre mariage coloré</h1>
            <p className="subtitle">
              Venez célébrer l’amour, les couleurs et la joie avec nous.
            </p>
          </div>
        </section>

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
          <h2>Merci d’être là</h2>
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
