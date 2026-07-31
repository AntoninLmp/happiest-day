import { useMemo } from "react";
const DEFAULT_NAME = "Cher invité, chère invitée";

export function useGuestName() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("invite");

    if (!raw) {
      return { name: DEFAULT_NAME, plural: true };
    }
    const name = raw.trim().replace(/\+/g, " ");

    // Détecte plusieurs invités : "Lise et Bernard", "Lise & Bernard", "Lise, Bernard"
    const plural = /( et | & |,)/i.test(name);

    return { name, plural };
  }, []);
}
