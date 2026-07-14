import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Confidentialité — RTCR" },
      { name: "description", content: "Politique de confidentialité de l'application RTCR." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AppShell>
      <article className="space-y-6">
        <header className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Confidentialité</span>
          <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
          <p className="text-xs text-on-surface-variant">Dernière mise à jour : 14 juillet 2026</p>
        </header>

        <section className="space-y-3 text-on-surface-variant">
          <p>
            La présente politique explique comment{" "}
            <span className="font-semibold text-on-surface">Radio Télévision Communautaire la Référence (RTCR)</span>{" "}
            collecte, utilise et protège vos informations dans cette application.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">1. Données collectées</h2>
          <p>
            L'application ne nécessite pas de compte utilisateur. Les seules données
            stockées le sont localement sur votre appareil : vos préférences (thème,
            réveil, notifications, cookies) et un cache technique pour l'affichage
            des actualités et du flux radio.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">2. Cookies et stockage local</h2>
          <p>
            Nous utilisons le stockage local (localStorage) pour mémoriser vos
            paramètres. Les cookies analytiques et marketing sont désactivés par
            défaut et ne sont activés qu'avec votre consentement explicite depuis
            la page Paramètres.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">3. Notifications</h2>
          <p>
            Les notifications sont facultatives. Vous pouvez les activer ou les
            désactiver à tout moment depuis les paramètres. Aucune notification
            n'est envoyée sans votre autorisation.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">4. Contenus externes</h2>
          <p>
            Les actualités et le flux audio proviennent de sources tierces
            (rtcr.net, Zeno.FM). Consulter un article ou écouter la radio implique
            une requête vers ces services, soumis à leurs propres politiques.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">5. Vos droits</h2>
          <p>
            Vous pouvez à tout moment effacer toutes les données locales de
            l'application depuis la page Paramètres. Pour toute question,
            contactez-nous à{" "}
            <a href="mailto:r_tv_la_reference96mhz@yahoo.com" className="text-primary underline">
              r_tv_la_reference96mhz@yahoo.com
            </a>.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">6. Contact</h2>
          <p>
            RTCR — Komanda, Q. Base II, République démocratique du Congo.<br />
            Téléphone : +243 812 875 481
          </p>
        </section>
      </article>
    </AppShell>
  );
}
