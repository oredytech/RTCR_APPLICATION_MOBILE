import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { fetchArticle } from "@/lib/actualites.functions";

export const Route = createFileRoute("/article/$slug")({
  head: () => ({
    meta: [
      { title: "Actualité — RTCR" },
      { name: "description", content: "Lisez cette actualité de RTCR directement dans l'application." },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle({ data: { slug } }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <AppShell>
      <div className="space-y-5">
        <Link
          to="/discover"
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Retour aux actualités
        </Link>

        {isLoading && (
          <div className="rounded-2xl p-6 glass-card text-sm text-on-surface-variant">
            Chargement de l'article…
          </div>
        )}
        {error && (
          <div className="rounded-2xl p-6 glass-card text-sm text-on-surface-variant">
            Impossible de charger l'article. Réessayez plus tard.
          </div>
        )}

        {data && (
          <article className="space-y-4">
            {data.image && (
              <img
                src={data.image}
                alt=""
                className="w-full rounded-2xl object-cover"
                loading="eager"
              />
            )}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary">
                rtcr.net · Actualité
              </span>
              <h1 className="text-3xl font-bold leading-tight">{data.title}</h1>
            </div>

            <div
              className="article-body text-on-surface"
              dangerouslySetInnerHTML={{ __html: data.html }}
            />

            <div className="mt-8 rounded-2xl p-4 glass-card">
              <p className="mb-3 text-sm text-on-surface-variant">
                Vous souhaitez commenter cet article ? Rendez-vous sur le site
                d'origine.
              </p>
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-opacity active:opacity-90"
              >
                <Icon name="chat_bubble" />
                Commenter sur rtcr.net
                <Icon name="open_in_new" className="text-[18px]" />
              </a>
            </div>
          </article>
        )}
      </div>
    </AppShell>
  );
}
