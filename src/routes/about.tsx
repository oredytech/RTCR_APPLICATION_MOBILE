import { createFileRoute, Link } from "@tanstack/react-router";
import { AppImage } from "@/components/AppImage";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { rtcrLogoSrc } from "@/lib/assets";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — RTCR" },
      {
        name: "description",
        content:
          "À propos de RTCR, ses services et son engagement communautaire. Radio Télévision Communautaire la Référence — Komanda, RDC.",
      },
    ],
  }),
  component: AboutPage,
});

const SERVICES = [
  {
    icon: "radio",
    title: "Diffusion radiophonique FM",
    desc: "Notre service garantit une diffusion claire, fiable et qualitative pour les auditeurs. Faites confiance à notre expertise pour un rayonnement optimal de votre contenu sonore.",
  },
  {
    icon: "videocam",
    title: "Couverture médiatique audio-visuelle des activités",
    desc: "Nous fournissons un service de couverture médiatique audio-visuelle complet et professionnel pour documenter et promouvoir vos activités. Notre équipe expérimentée capture sons, images et vidéos de haute qualité, réalise des interviews saisissantes et compile des reportages engageants qui mettent en valeur chaque moment clé de l'activité. Avec une expertise dans diverses plateformes médiatiques, nous garantissons une diffusion optimale pour atteindre votre public cible. Faites rayonner vos évènements grâce à notre expertise en communication audio-visuelle.",
  },
  {
    icon: "share",
    title: "Diffusion et publication sur les réseaux sociaux",
    desc: "Nous proposons un service professionnel de diffusion et publication sur les réseaux sociaux afin d'assurer une présence et une visibilité optimales de votre activité en ligne, grâce à des stratégies adaptées à vos objectifs et publics cibles.",
  },
];

function AboutPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl p-5 glass-card">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-white p-1">
              <AppImage
                src={rtcrLogoSrc}
                alt="Logo RTCR"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                À propos
              </span>
              <h1 className="text-2xl font-bold">RTCR</h1>
              <p className="text-xs text-on-surface-variant">
                Unité · Travail · Développement
              </p>
            </div>
          </div>
          <p className="text-on-surface-variant">
            <span className="font-semibold text-on-surface">
              Radio Télévision Communautaire la Référence
            </span>{" "}
            est dédiée à fournir des informations fiables, soutenir les
            initiatives communautaires afin de créer des liens et de renforcer
            la communauté grâce à des programmes pertinents et engageants.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Nos services</h2>
          <div className="space-y-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl p-4 glass-card transition-colors hover:border-primary/30"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon name={s.icon} filled />
                  </div>
                  <h3 className="font-bold leading-tight">{s.title}</h3>
                </div>
                <p className="text-sm text-on-surface-variant">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-start">
          <Link
            to="/connect"
            className="inline-flex items-center gap-2 rounded-xl bg-surface-container-high px-3 py-2 text-sm font-semibold text-on-surface"
          >
            <Icon name="arrow_back" className="text-[18px]" />
            Retour au contact
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
