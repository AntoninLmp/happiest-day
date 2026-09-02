import GlassNavBar from "./GlassNavBar";
import { LockKeyhole } from "lucide-react";

export default function Confirmation() {
  return (
    <div className="confirmation-page">
      <img src="./images/flowers.png" alt="" className="m-auto" />

      <header className="confirmation-header">
        <span className="confirmation-eyebrow">Répondez présent</span>
        <h1 className="instrument-serif-regular c-green2">Confirmer sa venue</h1>
        <p className="instrument-serif-regular c-green2">
          Nous avons hâte de partager cette journée avec vous.
        </p>
      </header>

      <main className="confirmation-card" aria-describedby="confirmation-status">
        <div className="confirmation-card__topline">
          <span>Votre réponse</span>
          <span className="confirmation-status-dot" aria-hidden="true"></span>
        </div>

        <div className="confirmation-form-wrap">
          <form className="confirmation-form" aria-disabled="true">
            <fieldset disabled>
              <legend className="instrument-serif-regular">Quelques détails</legend>

              <label htmlFor="attendance">Serez-vous parmi nous ?</label>
              <select id="attendance" defaultValue="">
                <option value="">Choisir une réponse</option>
                <option value="yes">Oui, avec joie !</option>
                <option value="no">Je ne pourrai pas venir</option>
              </select>

              <label htmlFor="guests">Nombre de personnes</label>
              <select id="guests" defaultValue="">
                <option value="">Choisir le nombre</option>
                <option value="1">1 personne</option>
                <option value="2">2 personnes</option>
              </select>

              <label htmlFor="diet">Une particularité alimentaire ?</label>
              <textarea id="diet" rows="2" placeholder="Votre réponse"></textarea>

              <button type="submit">Envoyer ma réponse</button>
            </fieldset>
          </form>

          <div className="confirmation-lock" id="confirmation-status">
            <span className="confirmation-lock__icon" aria-hidden="true">
              <LockKeyhole size={19} strokeWidth={1.8} />
            </span>
            <strong className="instrument-serif-regular">Le questionnaire arrive bientôt</strong>
            <p className="instrument-serif-regular">
              Il sera bientôt possible de confirmer votre présence ici.
            </p>
          </div>
        </div>
      </main>

      <GlassNavBar index={3} />
    </div>
  );
}
