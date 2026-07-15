import logoAsset from "@/assets/logo_rtcr.webp.asset.json";
import { useRadio } from "@/lib/radio-context";
import { Icon } from "./Icon";

export function NowPlayingBar() {
  const { playing, loading, toggle, muted, setMuted, volume } = useRadio();
  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 mx-auto flex h-16 max-w-2xl items-center gap-3 rounded-2xl border bg-surface-container/90 px-3 shadow-xl backdrop-blur-2xl">
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-white p-0.5">
        <img alt="RTCR" className="h-full w-full object-contain" src={logoAsset.url} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-on-surface">RTCR — 96.0 Mhz</p>
        <div className="flex items-end gap-1">
          <div className="flex h-3 items-end gap-[2px]">
            {[0.1, 0.3, 0.2].map((d, i) => (
              <span
                key={i}
                className="waveform-bar"
                style={{ animationDelay: `${d}s`, animationPlayState: playing ? "running" : "paused" }}
              />
            ))}
          </div>
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
            {loading ? "Chargement…" : playing ? "En direct" : "En pause"}
          </span>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          onClick={() => setMuted(!muted)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface transition-transform active:scale-90"
          aria-label={muted ? "Réactiver le son" : "Couper le son"}
        >
          <Icon name={muted || volume === 0 ? "volume_off" : "volume_up"} />
        </button>
        <button
          onClick={toggle}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_20px_rgba(26,75,255,0.4)] transition-transform active:scale-90"
          aria-label={playing ? "Pause" : "Lecture"}
        >
          <Icon name={playing ? "pause" : "play_arrow"} filled />
        </button>
      </div>
    </div>
  );
}
