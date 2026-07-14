import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation — RTCR" },
      { name: "description", content: "Conditions générales d'utilisation de l'application RTCR." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <AppShell>
      <article className="space-y-6">
        <header className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Conditions</span>
          <h1 className="text-3xl font-bold">Conditions d'utilisation</h1>
          <p className="text-xs text-on-surface-variant">Dernière mise à jour : 14 juillet 2026</p>
        </header>

        <section className="space-y-3 text-on-surface-variant">
          <h2 className="text-xl font-bold text-on-surface">1. Acceptation</h2>
          <p>
            En utilisant l'application RTCR, vous acceptez les présentes
            conditions. Si vous n'y consentez pas, veuillez ne pas utiliser
            l'application.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">2. Service</h2>
          <p>
            RTCR met à disposition l'écoute en direct de sa radio 96.0 Mhz FM
            ainsi que la consultation de ses actualités publiées sur rtcr.net.
            Le service peut être interrompu, modifié ou suspendu à tout moment.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">3. Propriété intellectuelle</h2>
          <p>
            Les contenus (articles, sons, images, logos) restent la propriété
            exclusive de RTCR ou de leurs auteurs respectifs. Toute reproduction
            ou rediffusion non autorisée est interdite.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">4. Comportement de l'utilisateur</h2>
          <p>
            Vous vous engagez à utiliser l'application dans le respect des lois
            en vigueur et à ne pas tenter de perturber son fonctionnement.
            Les commentaires publiés sur le site rtcr.net sont soumis aux
            règles éditoriales de la rédaction.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">5. Responsabilité</h2>
          <p>
            RTCR ne peut être tenue responsable des interruptions du flux
            radio, d'erreurs dans les contenus tiers, ni des dommages
            indirects résultant de l'usage de l'application.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">6. Modification</h2>
          <p>
            RTCR se réserve le droit de modifier les présentes conditions à
            tout moment. La version en vigueur est toujours disponible dans
            l'application.
          </p>

          <h2 className="pt-2 text-xl font-bold text-on-surface">7. Contact</h2>
          <p>
            Pour toute réclamation ou demande, écrivez-nous à{" "}
            <a href="mailto:r_tv_la_reference96mhz@yahoo.com" className="text-primary underline">
              r_tv_la_reference96mhz@yahoo.com
            </a>.
          </p>
        </section>
      </article>
    </AppShell>
  );
}
