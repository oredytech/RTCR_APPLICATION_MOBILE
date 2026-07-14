import { createServerFn } from "@tanstack/react-start";

export const fetchActualites = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getActualites } = await import("./rtcr-scraper.server");
    return getActualites();
  },
);

export const fetchArticle = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => {
    if (!data?.slug || typeof data.slug !== "string") throw new Error("slug requis");
    return data;
  })
  .handler(async ({ data }) => {
    const { getArticle } = await import("./rtcr-scraper.server");
    return getArticle(data.slug);
  });
