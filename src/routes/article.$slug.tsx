import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { AppImage } from "@/components/AppImage";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { fetchArticle } from "@/lib/actualites.functions";
import {
  addReadingHistory,
  getSavedArticle,
  removeSavedArticle,
  saveArticle,
  type ArticleSnapshot,
  type SavedArticle,
} from "@/lib/article-storage";
import { useSettings } from "@/lib/settings-context";

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
  const { settings } = useSettings();
  const [cachedArticle, setCachedArticle] = useState<SavedArticle | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = getSavedArticle(slug);
    setCachedArticle(saved);
    setIsSaved(Boolean(saved));
  }, [slug]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle({ data: { slug } }),
    staleTime: 5 * 60 * 1000,
  });

  const article = data ?? cachedArticle;
  const fromOfflineCache = Boolean(!data && cachedArticle);
  const isInitialLoading = isLoading && !article && !cachedArticle;

  useEffect(() => {
    if (!article) return;
    addReadingHistory(article);
  }, [article?.slug]);

  const articleClasses = useMemo(() => {
    const font = {
      small: "article-font-small",
      normal: "article-font-normal",
      large: "article-font-large",
      xlarge: "article-font-xlarge",
    }[settings.articleFontSize];
    const theme = {
      default: "article-theme-default",
      light: "article-theme-light",
      sepia: "article-theme-sepia",
      dark: "article-theme-dark",
    }[settings.articleTheme];
    const width = {
      compact: "max-w-2xl",
      comfortable: "max-w-3xl",
      wide: "max-w-5xl",
    }[settings.articleColumn];
    return `${font} ${theme} ${width}`;
  }, [settings.articleColumn, settings.articleFontSize, settings.articleTheme]);

  const toggleSaved = () => {
    if (!article) return;
    if (isSaved) {
      removeSavedArticle(article.slug);
      setIsSaved(false);
      setCachedArticle(null);
      return;
    }
    const snapshot: ArticleSnapshot = {
      slug: article.slug,
      title: article.title,
      url: article.url,
      image: article.image,
      html: article.html,
      pubDate: article.pubDate,
    };
    setCachedArticle(saveArticle(snapshot));
    setIsSaved(true);
  };

  return (
    <AppShell wide>
      <div className={`mx-auto space-y-5 ${articleClasses}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            to="/discover"
            className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary"
          >
            <Icon name="arrow_back" className="text-[18px]" />
            Retour aux actualités
          </Link>
          <Link
            to="/history"
            className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary"
          >
            <Icon name="history" className="text-[18px]" />
            Historique
          </Link>
        </div>

        {isInitialLoading && (
          <div className="rounded-2xl p-6 glass-card text-sm text-on-surface-variant">
            Chargement des informations…
          </div>
        )}
        {error && !article && (
          <div className="rounded-2xl p-6 glass-card text-sm text-on-surface-variant">
            Impossible de charger l'article. Les articles sauvegardés restent disponibles hors-ligne.
          </div>
        )}

        {article && (
          <article className="space-y-4">
            {fromOfflineCache && (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                <Icon name="download_done" className="text-[16px]" />
                Version sauvegardée hors-ligne
              </div>
            )}
            {article.image && (
              <AppImage
                src={article.image}
                alt={article.title}
                className="w-full rounded-2xl object-cover"
                loading="eager"
              />
            )}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary">
                rtcr.net · Actualité
              </span>
              <h1 className="break-words text-3xl font-bold leading-tight">{article.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-2xl p-2 glass-card">
              <button
                type="button"
                onClick={toggleSaved}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${isSaved ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface"}`}
              >
                <Icon name={isSaved ? "bookmark_added" : "bookmark_add"} className="text-[20px]" />
                {isSaved ? "Sauvegardé" : "Sauvegarder hors-ligne"}
              </button>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-surface-container-high px-3 py-2 text-sm font-semibold text-on-surface"
              >
                <Icon name="open_in_new" className="text-[20px]" />
                Voir sur le site
              </a>
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 rounded-xl bg-surface-container-high px-3 py-2 text-sm font-semibold text-on-surface"
              >
                <Icon name="text_fields" className="text-[20px]" />
                Mode lecture
              </Link>
            </div>

            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />

            <div className="mt-8 rounded-2xl p-4 glass-card">
              <p className="mb-3 text-sm text-on-surface-variant">
                Vous souhaitez commenter cet article ? Rendez-vous sur le site
                d'origine.
              </p>
              <a
                href={article.url}
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
