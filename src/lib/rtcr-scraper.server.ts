// Server-only scraper for https://rtcr.net/actualités

export type Actualite = {
  slug: string;      // path starting with /actualit%C3%A9s/
  key: string;       // decoded slug key for routing (last segment)
  title: string;
  url: string;
  image: string | null;
  pubDate: string;
};

export type ArticleDetail = {
  slug: string;
  title: string;
  url: string;
  image: string | null;
  html: string;
  pubDate: string;
};

type ListCache = { at: number; items: Actualite[] };
type ArticleCache = { at: number; item: ArticleDetail };

let listCache: ListCache | null = null;
const articleCache = new Map<string, ArticleCache>();
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

function keyFromSlugPath(slugPath: string) {
  // last segment, url-decoded, safe for our own routing
  const parts = slugPath.replace(/\/$/, "").split("/");
  const last = parts[parts.length - 1] ?? "";
  try { return decodeURIComponent(last); } catch { return last; }
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

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; RTCR-App/1.0; +https://rtcr.net)",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`Fetch ${url} failed: ${res.status}`);
  return res.text();
}

async function scrapeList(): Promise<Actualite[]> {
  const html = await fetchHtml(SOURCE_URL);

  const imgRe = /data-src="(https:\/\/files\.cdn-files-a\.com\/uploads\/10360214\/[^"]+)"/g;
  const imgPositions: Array<{ pos: number; url: string }> = [];
  for (const m of html.matchAll(imgRe)) {
    imgPositions.push({ pos: m.index ?? 0, url: m[1] });
  }

  const titleRe = /href="(\/actualit%C3%A9s\/[^"]+)"[^>]*>([^<]{20,300})<\/a>/g;

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
      key: keyFromSlugPath(slug),
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
  if (!force && listCache && now - listCache.at < TTL_MS) return listCache.items;
  try {
    const items = await scrapeList();
    listCache = { at: now, items };
    return items;
  } catch (err) {
    if (listCache) return listCache.items;
    throw err;
  }
}

// --- Article detail scraping ---

function stripDangerous(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/ on[a-z]+="[^"]*"/gi, "")
    .replace(/ on[a-z]+='[^']*'/gi, "");
}

function extractArticleBody(html: string): string {
  // Try common containers used by the site builder.
  const candidates = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*(?:blog|post|article|content-block)[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
  ];
  for (const re of candidates) {
    const m = html.match(re);
    if (m && m[1] && m[1].length > 400) return m[1];
  }
  // Fallback: grab everything between the title and the footer.
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m?.[1] ?? html;
}

function promoteLazyImages(html: string): string {
  return html.replace(/<img\b([^>]*?)\bdata-src="([^"]+)"([^>]*)>/gi, (_, a, src, b) => {
    return `<img${a} src="${src}"${b}>`;
  });
}

function absolutizeUrls(html: string): string {
  return html
    .replace(/(href|src)="\/(?!\/)/gi, `$1="${ORIGIN}/`)
    .replace(/(href|src)='\/(?!\/)/gi, `$1='${ORIGIN}/`);
}

async function scrapeArticle(slugKey: string): Promise<ArticleDetail> {
  const slugPath = `/actualit%C3%A9s/${encodeURIComponent(slugKey)}`;
  const url = `${ORIGIN}${slugPath}`;
  const html = await fetchHtml(url);

  const titleMatch =
    html.match(/<meta property="og:title" content="([^"]+)"/i) ||
    html.match(/<title>([^<]+)<\/title>/i);
  const title = decodeEntities(titleMatch?.[1]?.trim() ?? slugKey);

  const imgMatch =
    html.match(/<meta property="og:image" content="([^"]+)"/i) ||
    html.match(/data-src="(https:\/\/files\.cdn-files-a\.com\/uploads\/10360214\/[^"]+)"/i);
  const image = imgMatch?.[1] ?? null;

  let body = extractArticleBody(html);
  body = stripDangerous(body);
  body = promoteLazyImages(body);
  body = absolutizeUrls(body);

  return {
    slug: slugKey,
    title,
    url,
    image,
    html: body,
    pubDate: new Date().toISOString(),
  };
}

export async function getArticle(slugKey: string, force = false): Promise<ArticleDetail> {
  const now = Date.now();
  const cached = articleCache.get(slugKey);
  if (!force && cached && now - cached.at < TTL_MS) return cached.item;
  const item = await scrapeArticle(slugKey);
  articleCache.set(slugKey, { at: now, item });
  return item;
}
