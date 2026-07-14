import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "@/assets/logo_rtcr.webp.asset.json";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";
import { TopBar } from "@/components/TopBar";
import { useRadio } from "@/lib/radio-context";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Direct — RTCR 96.0 Mhz" },
      { name: "description", content: "Écoutez RTCR en direct — Radio 96.0 Mhz FM et TV canal 6 depuis Komanda, RDC." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const { playing, loading, error, toggle, volume, setVolume } = useRadio();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-surface">
      <TopBar title="RTCR" subtitle="En direct" showAvatar />
      <div className="absolute inset-x-0 top-0 -z-10 h-screen bg-gradient-to-b from-primary/20 via-background to-background" />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-32 pt-24">
        <div className="group relative mb-8 aspect-square w-full max-w-[340px]">
          <div className="absolute -inset-2 rounded-2xl bg-primary/25 opacity-60 blur-2xl transition-opacity group-hover:opacity-90" />
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white glass-panel">
            <img alt="Logo RTCR" className="h-full w-full object-contain p-6" src={logoAsset.url} />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl bg-secondary px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">En direct</span>
            </div>
          </div>
        </div>

        <div className="mb-8 w-full text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="flex h-6 items-end gap-1 px-2">
              {[0.1, 0.3, 0.2, 0.4, 0.15].map((d, i) => (
                <span
                  key={i}
                  className="waveform-bar"
                  style={{ animationDelay: `${d}s`, animationPlayState: playing ? "running" : "paused" }}
                />
              ))}
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Radio 96.0 Mhz FM
            </span>
          </div>
          <h2 className="mb-1 px-4 text-3xl font-bold">RTCR La Référence</h2>
          <p className="text-on-surface-variant">Komanda · République démocratique du Congo</p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="w-full space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div className={`h-full rounded-full bg-primary neon-glow ${playing ? "w-full animate-pulse" : "w-0"}`} />
            </div>
            <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
              <span>{loading ? "CHARGEMENT…" : playing ? "EN DIRECT" : "EN PAUSE"}</span>
              <div className="flex items-center gap-1">
                <Icon name="schedule" className="text-[14px]" />
                <span>Lun–Ven 04:50–21:00 · 24h/7 en ligne</span>
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-secondary/15 p-3 text-center text-xs font-medium text-secondary">
              {error}
            </p>
          )}

          <div className="flex items-center justify-around px-2">
            <a href="tel:+243812875481" aria-label="Appeler la station" className="text-on-surface-variant transition-transform hover:text-primary active:scale-90">
              <Icon name="call" className="text-[28px]" />
            </a>
            <button
              onClick={toggle}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-on-primary transition-transform neon-glow active:scale-95"
              aria-label={playing ? "Pause" : "Lecture"}
            >
              <Icon name={loading ? "hourglass_empty" : playing ? "pause" : "play_arrow"} filled className="text-[44px]" />
            </button>
            <a href="mailto:r_tv_la_reference96mhz@yahoo.com" aria-label="Envoyer un e-mail" className="text-on-surface-variant transition-transform hover:text-primary active:scale-90">
              <Icon name="mail" className="text-[28px]" />
            </a>
          </div>

          <div className="flex items-center gap-4 rounded-xl border bg-surface-container-low p-4">
            <Icon name="volume_down" className="text-on-surface-variant" />
            <input
              aria-label="Volume"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              type="range"
              min={0}
              max={100}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-surface-container-highest accent-primary"
            />
            <Icon name="volume_up" className="text-on-surface-variant" />
          </div>

          <p className="text-center text-[11px] text-on-surface-variant">
            Flux radio en direct fourni par Zeno.FM · stream.zeno.fm/cgxrxyyhjsrtv
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
