import { useState } from "react";
import { Icon } from "./Icon";

export function NowPlayingBar() {
  const [playing, setPlaying] = useState(true);
  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 mx-auto flex h-16 max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-surface-container/90 px-3 shadow-xl backdrop-blur-2xl">
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          alt="Now playing artwork"
          className="h-full w-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAohslooXhTfN984U3OWOjnpHByr-Bk_MNS5R1hifx2Xc50UvMCX-4M7UKeHS3ZjY03omzoAAiNpRe0U19FLRya_JeHDy_DxmyeGy3w85weBGCgBiLmm0wJBCXOlzLWlbnFkUsucCHGKHU06lk4aacYitx4SCI9VXzhMm815oPy_WVH4axnf8uMkb81u9EeOnpl4AqhkCOMoDNS1MbDrcamaLEcUt6i0-NAKp_XnPG6xKtmccYJpy-g"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">Midnight Sessions</p>
        <div className="flex items-end gap-1">
          <div className="flex h-3 items-end gap-[2px]">
            <span className="waveform-bar" style={{ animationDelay: "0.1s", animationPlayState: playing ? "running" : "paused" }} />
            <span className="waveform-bar" style={{ animationDelay: "0.3s", animationPlayState: playing ? "running" : "paused" }} />
            <span className="waveform-bar" style={{ animationDelay: "0.2s", animationPlayState: playing ? "running" : "paused" }} />
            <span className="waveform-bar" style={{ animationDelay: "0.4s", animationPlayState: playing ? "running" : "paused" }} />
          </div>
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-primary">
            Live now
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-on-surface-variant hover:text-secondary" aria-label="Favorite">
          <Icon name="favorite" />
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_20px_rgba(26,75,255,0.4)] transition-transform active:scale-90"
          aria-label={playing ? "Pause" : "Play"}
        >
          <Icon name={playing ? "pause" : "play_arrow"} filled />
        </button>
      </div>
    </div>
  );
}
