import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppImage } from "@/components/AppImage";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import {
  clearReadingHistory,
  listReadingHistory,
  listSavedArticles,
  type ReadingHistoryItem,
  type SavedArticle,
} from "@/lib/article-storage";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Historique — RTCR" },
      { name: "description", content: "Historique de lecture, articles sauvegardés hors-ligne et informations de l'application RTCR." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [saved, setSaved] = useState<SavedArticle[]>([]);

  const refresh = () => {
    setHistory(listReadingHistory());
    setSaved(listSavedArticles());
  };

  useEffect(() => {
    refresh();
  }, []);

  const clear = () => {
    if (!confirm("Effacer l'historique de lecture ?")) return;
    clearReadingHistory();
    refresh();
  };

  return (
    <AppShell title="Historique">
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Historique</h1>
          <p className="text-on-surface-variant">Articles lus, sauvegardes hors-ligne et informations de l'application.</p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Articles sauvegardés</h2>
            <span className="rounded-full bg-primary/15 px-2 py-1 text-xs font-semibold text-primary">{saved.length}</span>
          </div>
          {saved.length === 0 ? (
            <EmptyState icon="bookmark" text="Aucun article sauvegardé pour le moment." />
          ) : (
            <div className="space-y-3">{saved.map((item) => <ArticleRow key={item.slug} item={item} date={item.savedAt} label="Sauvegardé" />)}</div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Lectures récentes</h2>
            {history.length > 0 && (
              <button onClick={clear} className="text-xs font-semibold uppercase tracking-widest text-secondary">
                Effacer
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <EmptyState icon="history" text="L'historique apparaîtra après l'ouverture d'un article." />
          ) : (
            <div className="space-y-3">{history.map((item) => <ArticleRow key={item.slug} item={item} date={item.readAt} label="Lu" />)}</div>
          )}
        </section>

        <section className="rounded-2xl p-4 glass-card">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon name="info" />
            </div>
            <div>
              <h2 className="font-bold">À propos de l'application</h2>
              <p className="text-xs text-on-surface-variant">RTCR — Radio Télévision Communautaire la Référence</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-on-surface-variant">
            Application créée par{" "}
            <a href="https://oredytech.com" target="_blank" rel="noreferrer" className="font-semibold text-primary underline">
              Oredy TECHNOLOGIES
            </a>
            . Les contenus proviennent des API et flux publics de RTCR.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="rounded-2xl p-5 glass-card text-sm text-on-surface-variant">
      <Icon name={icon} className="mb-2 text-[28px] text-primary" />
      <p>{text}</p>
    </div>
  );
}

function ArticleRow({ item, date, label }: { item: ReadingHistoryItem | SavedArticle; date: string; label: string }) {
  return (
    <Link to="/article/$slug" params={{ slug: item.slug }} className="group flex gap-3 rounded-2xl p-3 glass-card transition-transform active:scale-[0.99]">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
        {item.image ? <AppImage src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center text-on-surface-variant"><Icon name="newspaper" /></div>}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary">{label} · {formatDate(date)}</span>
        <h3 className="mt-1 line-clamp-2 font-bold leading-tight group-hover:text-primary">{item.title}</h3>
      </div>
    </Link>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}