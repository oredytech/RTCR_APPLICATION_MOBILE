import { createServerFn } from "@tanstack/react-start";

export const fetchActualites = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getActualites } = await import("./rtcr-scraper.server");
    return getActualites();
  },
);
