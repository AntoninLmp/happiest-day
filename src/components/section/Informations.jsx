import GlassNavBar from "./GlassNavBar";
import DressCodeSection from "./DressCodeSection";
import { LockKeyhole, Notebook, MapPin, Utensils } from "lucide-react";

export default function Informations() {
  return (
    <div>
      <img src="./images/flowers.png" alt="hands" className="m-auto" />
      <DressCodeSection />
      <div className="flex items-center justify-center pb-2">
        <Notebook size={19} strokeWidth={1.8} className="inline-block mr-2" />
        <h1 className="instrument-serif-regular c-green2">
          Programme de la journée
        </h1>
      </div>
      <section>
        <div className="programme-coming-soon mx-5 md:mx-[20%]" aria-live="polite">
          <div className="programme-coming-soon__content">
            <span className="programme-coming-soon__eyebrow">Le programme</span>
            <span
              className="programme-coming-soon__line"
              aria-hidden="true"
            ></span>
            <span className="confirmation-lock__icon" aria-hidden="true">
              <LockKeyhole size={19} strokeWidth={1.8} />
            </span>
            <h2 className="instrument-serif-regular c-green2">
              Encore un peu de patience...
            </h2>
            <p className="instrument-serif-regular c-green2">
              Les détails de cette belle journée arrivent bientôt.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center pb-2">
        <MapPin size={19} strokeWidth={1.8} className="inline-block mr-2" />
        <h1 className="instrument-serif-regular c-green2">
          Le lieu pour la mairie
        </h1>
      </div>
      <section>
        <div className="programme-coming-soon mx-5 md:mx-[20%]" aria-live="polite">
          <div className="programme-coming-soon__content">
            <span className="confirmation-lock__icon" aria-hidden="true">
              <LockKeyhole size={19} strokeWidth={1.8} />
            </span>
            <h2 className="instrument-serif-regular c-green2">
              On ne révèle pas encore le lieu...
            </h2>
            <p className="instrument-serif-regular c-green2">
              On n'en sait rien de toute façon.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center pb-2">
        <Utensils size={19} strokeWidth={1.8} className="inline-block mr-2" />
        <h1 className="instrument-serif-regular c-green2">
          Menu
        </h1>
      </div>
      <section>
        <div className="programme-coming-soon mx-5 md:mx-[20%] mb-10" aria-live="polite">
          <div className="programme-coming-soon__content">
            <span className="confirmation-lock__icon" aria-hidden="true">
              <LockKeyhole size={19} strokeWidth={1.8} />
            </span>
            <h2 className="instrument-serif-regular c-green2">
              C'est là qu'on reconnaît les gourmands  ...
            </h2>
            <p className="instrument-serif-regular c-green2">
              Le marié a déjà hâte de manger aussi !
            </p>
          </div>
        </div>
      </section>

      <GlassNavBar index={2} />
    </div>
  );
}
