// Server-only scraper for https://rtcr.net/actualités
// Extracts articles from the news listing and caches them in-memory for 5 minutes.

export type Actualite = {
  slug: string;
  title: string;
  url: string;
  image: string | null;
  pubDate: string; // ISO
};

type CacheEntry = { at: number; items: Actualite[] };
let cache: CacheEntry | null = null;
const TTL_MS = 5 * 60 * 1000;

const SOURCE_URL = "https://rtcr.net/actualit%C3%A9s";
const ORIGIN = "https://rtcr.net";

function decodeEntities(s: string) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function xmlEscape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toRss(items: Actualite[]): string {
  const now = new Date().toUTCString();
  const entries = items
    .map(
      (a) => `    <item>
      <title>${xmlEscape(a.title)}</title>
      <link>${xmlEscape(a.url)}</link>
      <guid isPermaLink="true">${xmlEscape(a.url)}</guid>
      <pubDate>${new Date(a.pubDate).toUTCString()}</pubDate>
      ${a.image ? `<enclosure url="${xmlEscape(a.image)}" type="image/jpeg" />` : ""}
      <description>${xmlEscape(a.title)}</description>
    </item>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>RTCR — Actualités</title>
    <link>${SOURCE_URL}</link>
    <description>Flux RSS des dernières actualités de Radio Télévision Communautaire la Référence</description>
    <language>fr</language>
    <lastBuildDate>${now}</lastBuildDate>
${entries}
  </channel>
</rss>`;
}

async function scrape(): Promise<Actualite[]> {
  const res = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; RTCR-App/1.0; +https://rtcr.net)",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`Fetch ${SOURCE_URL} failed: ${res.status}`);
  const html = await res.text();

  // Positions of article images loaded via lazy data-src.
  const imgRe = /data-src="(https:\/\/files\.cdn-files-a\.com\/uploads\/10360214\/[^"]+)"/g;
  const imgPositions: Array<{ pos: number; url: string }> = [];
  for (const m of html.matchAll(imgRe)) {
    imgPositions.push({ pos: m.index ?? 0, url: m[1] });
  }

  // Anchor tags containing article titles.
  const titleRe =
    /href="(\/actualit%C3%A9s\/[^"]+)"[^>]*>([^<]{20,300})<\/a>/g;

  const seen = new Set<string>();
  const items: Actualite[] = [];
  for (const m of html.matchAll(titleRe)) {
    const slug = m[1];
    const rawTitle = decodeEntities(m[2]).trim();
    if (!rawTitle || rawTitle.toLowerCase() === "actualités") continue;
    if (/^en savoir plus$/i.test(rawTitle)) continue;
    if (/^\d{1,2}[A-Za-z]{2,4}$/.test(rawTitle)) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    const pos = m.index ?? 0;
    const prevImg = [...imgPositions].reverse().find((i) => i.pos < pos);
    items.push({
      slug,
      title: rawTitle,
      url: `${ORIGIN}${slug}`,
      image: prevImg?.url ?? null,
      pubDate: new Date().toISOString(),
    });
  }
  return items;
}

export async function getActualites(force = false): Promise<Actualite[]> {
  const now = Date.now();
  if (!force && cache && now - cache.at < TTL_MS) return cache.items;
  try {
    const items = await scrape();
    cache = { at: now, items };
    return items;
  } catch (err) {
    if (cache) return cache.items; // serve stale on error
    throw err;
  }
}
