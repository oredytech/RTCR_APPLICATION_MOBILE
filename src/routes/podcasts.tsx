import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/podcasts")({
  head: () => ({
    meta: [
      { title: "Podcasts — RTCR" },
      {
        name: "description",
        content:
          "Podcasts de RTCR — émissions et rediffusions à la demande de Radio Télévision Communautaire la Référence.",
      },
    ],
  }),
  component: PodcastsPage,
});

const PODCASTS = [
  {
    title: "Journal parlé",
    desc: "Retour sur les faits marquants de la journée à Komanda et dans la région.",
    icon: "mic",
    duration: "20 min",
  },
  {
    title: "Voix communautaires",
    desc: "Portraits et témoignages d'acteurs de la communauté.",
    icon: "groups",
    duration: "30 min",
  },
  {
    title: "Grand débat",
    desc: "Émission d'analyse et de discussion autour des enjeux du moment.",
    icon: "forum",
    duration: "45 min",
  },
  {
    title: "Culture & Musique",
    desc: "Sélections musicales et actualités culturelles locales.",
    icon: "library_music",
    duration: "40 min",
  },
];

function PodcastsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <section className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            À la demande
          </span>
          <h1 className="text-3xl font-bold tracking-tight">Podcasts RTCR</h1>
          <p className="text-on-surface-variant">
            Retrouvez bientôt nos émissions à la demande. Les rediffusions
            seront disponibles ici.
          </p>
        </section>

        <section className="space-y-3">
          {PODCASTS.map((p) => (
            <div
              key={p.title}
              className="flex items-center gap-4 rounded-2xl p-4 glass-card"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon name={p.icon} filled className="text-[28px]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold">{p.title}</h3>
                <p className="line-clamp-2 text-sm text-on-surface-variant">
                  {p.desc}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-secondary">
                  <Icon name="schedule" className="text-[12px]" />
                  {p.duration}
                </span>
              </div>
              <button
                type="button"
                disabled
                aria-label="Bientôt disponible"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant opacity-70"
              >
                <Icon name="hourglass_empty" />
              </button>
            </div>
          ))}
        </section>

        <p className="rounded-2xl p-4 glass-card text-center text-xs text-on-surface-variant">
          Les épisodes seront publiés progressivement. Écoutez la radio en
          direct en attendant.
        </p>
      </div>
    </AppShell>
  );
}
