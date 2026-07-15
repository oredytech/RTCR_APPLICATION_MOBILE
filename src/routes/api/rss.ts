import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/api/rss")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getActualites, toRss } = await import(
          "@/lib/rtcr-scraper.server"
        );
        const items = await getActualites();
        const appBaseUrl = new URL(request.url).origin;
        return new Response(toRss(items, appBaseUrl), {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
