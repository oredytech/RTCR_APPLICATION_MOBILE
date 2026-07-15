import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppImage } from "@/components/AppImage";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { fetchActualites } from "@/lib/actualites.functions";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Actualités — RTCR" },
      {
        name: "description",
        content:
          "Toutes les actualités de RTCR — Radio Télévision Communautaire la Référence, mises à jour toutes les 5 minutes depuis rtcr.net.",
      },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [q, setQ] = useState("");
  const { data: actus = [], isLoading, refetch, isFetching, dataUpdatedAt } =
    useQuery({
      queryKey: ["actualites"],
      queryFn: () => fetchActualites(),
      refetchInterval: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
    });

  const filtered = useMemo(() => {
    if (!q.trim()) return actus;
    const n = q.toLowerCase();
    return actus.filter((a) => a.title.toLowerCase().includes(n));
  }, [actus, q]);

  const updated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Actualités</h1>
          <p className="text-on-surface-variant">
            Flux en direct depuis rtcr.net · mise à jour toutes les 5 min ·
            dernière synchro {updated}
          </p>
        </section>

        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Rechercher une actualité"
            className="h-14 w-full rounded-2xl border-none bg-surface-container-high pl-12 pr-24 text-on-surface outline-none transition-all placeholder:text-outline focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => refetch()}
            className="absolute right-2 top-1/2 flex h-10 -translate-y-1/2 items-center gap-1 rounded-xl bg-primary/15 px-3 text-xs font-semibold uppercase tracking-widest text-primary transition-opacity active:opacity-70"
          >
            <Icon
              name="refresh"
              className={`text-[16px] ${isFetching ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
        </div>

        <section className="space-y-3">
          {isLoading && (
            <p className="rounded-2xl p-4 glass-card text-sm text-on-surface-variant">
              Récupération des articles en cours…
            </p>
          )}
          {!isLoading && filtered.length === 0 && (
            <p className="rounded-2xl p-4 glass-card text-sm text-on-surface-variant">
              Aucune actualité ne correspond à votre recherche.
            </p>
          )}
          {filtered.map((a) => (
            <a
              key={a.slug}
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="group flex gap-4 overflow-hidden rounded-2xl p-3 glass-card transition-transform active:scale-[0.99]"
            >
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                {a.image ? (
                  <AppImage
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    src={a.image}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                    <Icon name="newspaper" />
                  </div>
                )}
              </div>
              <div className="flex flex-grow flex-col justify-center gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary">
                  rtcr.net
                </span>
                <h3 className="line-clamp-3 font-bold leading-tight group-hover:text-primary">
                  {a.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <Icon name="menu_book" className="text-[14px]" />
                  <span>Lire dans l'application</span>
                </div>
              </div>
            </a>
          ))}
        </section>

        <p className="pt-2 text-center text-[11px] text-on-surface-variant">
          Flux RSS disponible :{" "}
          <a href="/api/rss" className="text-primary underline">
            /api/rss
          </a>
        </p>
      </div>
    </AppShell>
  );
}
