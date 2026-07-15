import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { NowPlayingBar } from "./NowPlayingBar";
import { TopBar } from "./TopBar";

export function AppShell({
  children,
  title,
  showAvatar,
  showNowPlaying = true,
  wide = false,
}: {
  children: ReactNode;
  title?: string;
  showAvatar?: boolean;
  showNowPlaying?: boolean;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <TopBar title={title} showAvatar={showAvatar} />
      <main className={`mx-auto px-5 pb-44 pt-20 ${wide ? "max-w-5xl" : "max-w-2xl"}`}>{children}</main>
      {showNowPlaying && <NowPlayingBar />}
      <BottomNav />
    </div>
  );
}
