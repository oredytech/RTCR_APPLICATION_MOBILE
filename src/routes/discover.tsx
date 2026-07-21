import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppImage } from "@/components/AppImage";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { fetchActualites } from "@/lib/actualites.functions";

function AdBanner() {
  return (
    <a
      href="/connect"
      className="relative block overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary via-primary/80 to-secondary p-5 text-white shadow-lg transition-transform active:scale-[0.99]"
    >
      <span className="absolute right-3 top-3 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
        Publicité
      </span>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
          <Icon name="campaign" filled className="text-[28px]" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
            Espace annonceur
          </p>
          <h3 className="text-lg font-bold leading-tight">
            Faites rayonner votre marque sur RTCR
          </h3>
          <p className="mt-1 text-xs text-white/85">
            Contactez la régie pour réserver cet espace.
          </p>
        </div>
      </div>
    </a>
  );
}


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
  const [redirectionMessage, setRedirectionMessage] = useState<string | null>(null);
  const { data: actus = [], isLoading, refetch, isFetching, dataUpdatedAt } =
    useQuery({
      queryKey: ["actualites"],
      queryFn: () => fetchActualites(),
      refetchInterval: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
    });

  const handleRedirect = (url: string) => {
    setRedirectionMessage("Vous allez être redirigé vers le site 'rtcr.net'.");
    window.open(url, "_blank", "noopener");
    window.setTimeout(() => setRedirectionMessage(null), 3200);
  };

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
            className="h-14 w-full rounded-2xl border-none bg-surface-container-high pl-12 pr-16 text-on-surface outline-none transition-all placeholder:text-outline focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => refetch()}
            aria-label="Actualiser les actualités"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-primary/15 text-primary transition-opacity hover:bg-primary/20 active:opacity-70"
          >
            <Icon
              name="refresh"
              className={`text-[18px] ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <AdBanner />

        {redirectionMessage ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {redirectionMessage}
          </div>
        ) : null}

        <Link
          to="/podcasts"
          className="flex items-center gap-3 rounded-2xl p-4 glass-card transition-transform active:scale-[0.99]"
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
            <Icon name="podcasts" filled />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary">Nouveau</p>
            <h3 className="font-bold">Écouter les podcasts RTCR</h3>
          </div>
          <Icon name="chevron_right" className="text-on-surface-variant" />
        </Link>

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
              onClick={(event) => {
                event.preventDefault();
                handleRedirect(a.url);
              }}
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
