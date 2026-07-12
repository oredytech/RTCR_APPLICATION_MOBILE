import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { NowPlayingBar } from "./NowPlayingBar";
import { TopBar } from "./TopBar";

export function AppShell({
  children,
  title,
  showAvatar,
  showNowPlaying = true,
}: {
  children: ReactNode;
  title?: string;
  showAvatar?: boolean;
  showNowPlaying?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <TopBar title={title} showAvatar={showAvatar} />
      <main className="mx-auto max-w-2xl px-5 pb-44 pt-20">{children}</main>
      {showNowPlaying && <NowPlayingBar />}
      <BottomNav />
    </div>
  );
}
