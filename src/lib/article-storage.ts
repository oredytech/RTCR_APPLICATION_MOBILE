export type ArticleSnapshot = {
  slug: string;
  title: string;
  url: string;
  image: string | null;
  html: string;
  pubDate: string;
};

export type SavedArticle = ArticleSnapshot & {
  savedAt: string;
};

export type ReadingHistoryItem = ArticleSnapshot & {
  readAt: string;
};

const SAVED_KEY = "rtcr.savedArticles.v1";
const HISTORY_KEY = "rtcr.readingHistory.v1";
const HISTORY_LIMIT = 80;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readArray<T>(key: string): T[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or unavailable in private browsing.
  }
}

export function listSavedArticles(): SavedArticle[] {
  return readArray<SavedArticle>(SAVED_KEY).sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );
}

export function getSavedArticle(slug: string): SavedArticle | null {
  return listSavedArticles().find((a) => a.slug === slug) ?? null;
}

export function saveArticle(article: ArticleSnapshot): SavedArticle {
  const next: SavedArticle = { ...article, savedAt: new Date().toISOString() };
  const others = listSavedArticles().filter((a) => a.slug !== article.slug);
  writeArray(SAVED_KEY, [next, ...others]);
  return next;
}

export function removeSavedArticle(slug: string) {
  writeArray(
    SAVED_KEY,
    listSavedArticles().filter((a) => a.slug !== slug),
  );
}

export function listReadingHistory(): ReadingHistoryItem[] {
  return readArray<ReadingHistoryItem>(HISTORY_KEY).sort(
    (a, b) => new Date(b.readAt).getTime() - new Date(a.readAt).getTime(),
  );
}

export function addReadingHistory(article: ArticleSnapshot) {
  const next: ReadingHistoryItem = { ...article, readAt: new Date().toISOString() };
  const others = listReadingHistory().filter((a) => a.slug !== article.slug);
  writeArray(HISTORY_KEY, [next, ...others].slice(0, HISTORY_LIMIT));
}

export function clearReadingHistory() {
  writeArray(HISTORY_KEY, []);
}