import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Radio — SoundStream" },
      { name: "description", content: "Tune into Midnight Pulse FM and live radio streams on SoundStream." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const [playing, setPlaying] = useState(true);
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-surface">
      <TopBar title="SoundStream" showAvatar />
      <div className="absolute inset-x-0 top-0 -z-10 h-screen bg-gradient-to-b from-primary/15 via-background to-background" />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-32 pt-24">
        <div className="group relative mb-8 aspect-square w-full max-w-[340px]">
          <div className="absolute -inset-2 rounded-2xl bg-primary/25 opacity-60 blur-2xl transition-opacity group-hover:opacity-90" />
          <div className="relative h-full w-full overflow-hidden rounded-2xl glass-panel">
            <img
              alt="Techno Resonance cover"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXdDeggoAFDoPnMaaJcUZsMijAu2iHXAkz-Hr7HRFW7yHRTul41Q-0mtuURcBKKz1aI5IbkKRknELYJ01q-5MtGd1NUaoUtJUTlOtODSVHrlfB_YVSBPmB8q34csWij5C9n6Kor8zgjdvs8lC9MKdVQwXcaGLbXrpi0ya2_raDhIxQ-DTSHc2feVNR30sFFC-JfOk6nknQ6sVkmYQqTNWY_de2Y1Gt1rKdisQpzq7Na3qN8uDglaLJ"
            />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl bg-secondary px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live</span>
            </div>
          </div>
        </div>

        <div className="mb-8 w-full text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="flex h-6 items-end gap-1 px-2">
              <span className="waveform-bar" style={{ animationPlayState: playing ? "running" : "paused" }} />
              <span className="waveform-bar" style={{ animationDuration: "0.8s", animationPlayState: playing ? "running" : "paused" }} />
              <span className="waveform-bar" style={{ animationDuration: "1.2s", animationPlayState: playing ? "running" : "paused" }} />
              <span className="waveform-bar" style={{ animationDuration: "0.7s", animationPlayState: playing ? "running" : "paused" }} />
              <span className="waveform-bar" style={{ animationDuration: "0.9s", animationPlayState: playing ? "running" : "paused" }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Midnight Pulse FM
            </span>
          </div>
          <h2 className="mb-1 truncate px-4 text-3xl font-bold">Techno Resonance</h2>
          <p className="text-on-surface-variant">Host: DJ Kinetic</p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="w-full space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div className="h-full w-3/4 rounded-full bg-primary neon-glow" />
            </div>
            <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
              <span>LIVE</span>
              <div className="flex items-center gap-1">
                <Icon name="group" className="text-[14px]" />
                <span>12.4k listeners</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <button className="text-on-surface-variant transition-transform hover:text-primary active:scale-90">
              <Icon name="favorite" className="text-[28px]" />
            </button>
            <button className="text-on-surface-variant transition-transform hover:text-primary active:scale-90">
              <Icon name="skip_previous" className="text-[36px]" />
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-on-primary transition-transform neon-glow active:scale-95"
              aria-label={playing ? "Pause" : "Play"}
            >
              <Icon name={playing ? "pause" : "play_arrow"} filled className="text-[44px]" />
            </button>
            <button className="text-on-surface-variant transition-transform hover:text-primary active:scale-90">
              <Icon name="skip_next" className="text-[36px]" />
            </button>
            <button className="text-on-surface-variant transition-transform hover:text-primary active:scale-90">
              <Icon name="share" className="text-[28px]" />
            </button>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface-container-low p-4">
            <Icon name="volume_down" className="text-on-surface-variant" />
            <input
              aria-label="Volume"
              defaultValue={65}
              type="range"
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-surface-container-highest accent-primary"
            />
            <Icon name="volume_up" className="text-on-surface-variant" />
          </div>
        </div>
      </main>

      <button
        aria-label="Open chat"
        className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-secondary text-on-secondary shadow-2xl transition-transform active:scale-90"
      >
        <Icon name="chat_bubble" filled className="text-[26px]" />
      </button>
      <BottomNav />
    </div>
  );
}
