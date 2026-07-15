import { Link, useRouterState } from "@tanstack/react-router";
import { Icon } from "./Icon";

const items = [
  { to: "/", label: "Accueil", icon: "home" },
  { to: "/live", label: "Direct", icon: "radio" },
  { to: "/discover", label: "Actualités", icon: "newspaper" },
  { to: "/history", label: "Historique", icon: "history" },
  { to: "/connect", label: "Contact", icon: "call" },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around rounded-t-2xl border-t border-white/5 bg-surface-container/90 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 transition-transform active:scale-90 ${
              active
                ? "text-primary drop-shadow-[0_0_8px_rgba(26,75,255,0.4)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name={item.icon} filled={active} />
            <span className="max-w-full truncate text-[9px] font-medium uppercase tracking-wide sm:text-[10px]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
