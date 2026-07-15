import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SettingsProvider } from "../lib/settings-context";
import { RadioProvider } from "../lib/radio-context";

const THEME_INIT_SCRIPT = `(() => { try { var s = localStorage.getItem('rtcr.settings.v1'); var t = s ? (JSON.parse(s).theme || 'light') : 'light'; var dark = t === 'dark' || (t === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); var r = document.documentElement; r.classList.toggle('dark', dark); r.classList.toggle('light', !dark); } catch(e){} })();`;


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-on-surface">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-on-surface">Page introuvable</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:opacity-90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-on-surface">
          Cette page n'a pas pu se charger
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Une erreur s'est produite. Réessayez ou revenez à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:opacity-90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-white/5"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "RTCR — Radio Télévision Communautaire la Référence" },
      {
        name: "description",
        content:
          "RTCR : Radio Télévision Communautaire la Référence. Actualités, radio FM 96.0 Mhz et TV canal 6 en direct depuis Komanda, RDC.",
      },
      { name: "application-name", content: "RTCR" },
      { name: "apple-mobile-web-app-title", content: "RTCR" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { property: "og:title", content: "RTCR — Radio Télévision Communautaire la Référence" },
      {
        property: "og:description",
        content:
          "Actualités, radio FM 96.0 Mhz et TV canal 6 en direct depuis Komanda, RDC.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#1a4bff", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#090b12", media: "(prefers-color-scheme: dark)" },
      { name: "format-detection", content: "telephone=yes" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icons/icon-192.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="light">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  if (isBooting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex w-full max-w-sm flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/15 text-primary shadow-[0_0_30px_rgba(26,75,255,0.15)]">
            <span className="text-4xl font-black tracking-tight">RT</span>
          </div>
          <div className="mb-4 h-2 w-32 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-on-surface">
            Chargement de RTCR…
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Préparation de l’application et de vos contenus.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <RadioProvider>
          <Outlet />
        </RadioProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
