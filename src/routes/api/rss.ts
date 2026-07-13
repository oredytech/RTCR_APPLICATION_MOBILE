import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/api/rss")({
  server: {
    handlers: {
      GET: async () => {
        const { getActualites, toRss } = await import(
          "@/lib/rtcr-scraper.server"
        );
        const items = await getActualites();
        return new Response(toRss(items), {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
