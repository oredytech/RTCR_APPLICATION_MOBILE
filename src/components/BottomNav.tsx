import { Link, useRouterState } from "@tanstack/react-router";
import { Icon } from "./Icon";

const items = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/live", label: "Live", icon: "radio" },
  { to: "/discover", label: "Discover", icon: "explore" },
  { to: "/connect", label: "Connect", icon: "chat_bubble" },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around rounded-t-2xl border-t border-white/5 bg-surface-container/90 px-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 transition-transform active:scale-90 ${
              active
                ? "text-primary drop-shadow-[0_0_8px_rgba(26,75,255,0.4)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name={item.icon} filled={active} />
            <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
