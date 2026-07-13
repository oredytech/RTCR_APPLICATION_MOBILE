import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import logoAsset from "@/assets/logo_rtcr.webp.asset.json";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { fetchActualites } from "@/lib/actualites.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accueil — RTCR" },
      {
        name: "description",
        content:
          "RTCR — Radio Télévision Communautaire la Référence. Radio FM 96.0 Mhz, TV canal 6, actualités et services depuis Komanda, RDC.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: actus = [] } = useQuery({
    queryKey: ["actualites"],
    queryFn: () => fetchActualites(),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  const top = actus.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-10">
        <section className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Bienvenue sur RTCR
          </span>
          <h1 className="text-3xl font-bold tracking-tight">
            La Référence, à votre écoute
          </h1>
          <p className="text-on-surface-variant">
            Radio Télévision Communautaire la Référence — informations fiables
            et programmes engageants pour renforcer notre communauté.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">En direct</h2>
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
              On air
            </span>
          </div>
          <Link
            to="/live"
            className="group relative block h-56 w-full overflow-hidden rounded-2xl glass-card transition-transform active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-surface to-surface" />
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-30">
              <img
                src={logoAsset.url}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-4 items-end gap-1">
                  <span className="waveform-bar" style={{ animationDelay: "0.1s" }} />
                  <span className="waveform-bar" style={{ animationDelay: "0.3s" }} />
                  <span className="waveform-bar" style={{ animationDelay: "0.2s" }} />
                  <span className="waveform-bar" style={{ animationDelay: "0.4s" }} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Radio 96.0 Mhz · TV Canal 6
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold leading-tight">
                    Écoutez RTCR en direct
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Lun–Ven 04h50–21h00 · en ligne 24h/7
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_20px_rgba(26,75,255,0.4)] transition-transform active:scale-90">
                  <Icon name="play_arrow" filled className="text-[32px]" />
                </div>
              </div>
            </div>
          </Link>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Dernières actualités</h2>
            <Link
              to="/discover"
              className="text-xs font-semibold uppercase tracking-widest text-primary"
            >
              Tout voir
            </Link>
          </div>
          {top.length === 0 ? (
            <p className="rounded-2xl p-4 glass-card text-sm text-on-surface-variant">
              Chargement des actualités depuis rtcr.net…
            </p>
          ) : (
            <div className="space-y-3">
              {top.map((a) => (
                <a
                  key={a.slug}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl p-3 glass-card transition-transform active:scale-[0.99]"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                    {a.image ? (
                      <img
                        alt=""
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        src={a.image}
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                        <Icon name="newspaper" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary">
                      rtcr.net · Actualité
                    </span>
                    <h4 className="line-clamp-2 font-bold leading-tight group-hover:text-primary">
                      {a.title}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Nos services</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl p-4 glass-card">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon name={s.icon} filled />
                </div>
                <h3 className="mb-1 font-bold">{s.title}</h3>
                <p className="line-clamp-3 text-sm text-on-surface-variant">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

const SERVICES = [
  {
    icon: "radio",
    title: "Diffusion radiophonique FM",
    desc: "Une diffusion claire, fiable et qualitative pour les auditeurs. Notre expertise assure un rayonnement optimal de votre contenu sonore.",
  },
  {
    icon: "videocam",
    title: "Couverture médiatique audio-visuelle",
    desc: "Couverture professionnelle et complète : sons, images, interviews et reportages engageants pour valoriser chaque moment clé de votre activité.",
  },
  {
    icon: "share",
    title: "Diffusion sur les réseaux sociaux",
    desc: "Stratégies adaptées à vos objectifs et publics cibles pour assurer une présence et une visibilité optimales de votre activité en ligne.",
  },
  {
    icon: "campaign",
    title: "Événements & annonces",
    desc: "Faites rayonner vos évènements grâce à notre expertise en communication audio-visuelle sur toutes nos plateformes.",
  },
];
