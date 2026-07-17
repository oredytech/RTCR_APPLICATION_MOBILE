import { createFileRoute } from "@tanstack/react-router";
import { AppImage } from "@/components/AppImage";
import { BottomNav } from "@/components/BottomNav";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@/components/Icon";
import { LiveChat } from "@/components/LiveChat";
import { WhatsAppComposer } from "@/components/WhatsAppComposer";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { rtcrLogoSrc } from "@/lib/assets";
import { TopBar } from "@/components/TopBar";
import { useRadio } from "@/lib/radio-context";
import { useSettings } from "@/lib/settings-context";

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
  const { playing, loading, error, toggle, pause, volume, setVolume, muted, setMuted, quality, setQuality } = useRadio();
  const { settings, update } = useSettings();
  const isLive = playing || loading;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-surface">
      <TopBar title="RTCR" subtitle="En direct" showAvatar />
      <div className="absolute inset-x-0 top-0 -z-10 h-screen bg-gradient-to-b from-primary/20 via-background to-background" />
      <main className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-32 pt-24">
        <div className="group relative mb-8 aspect-square w-full max-w-[340px]">
          <div className="absolute -inset-2 rounded-2xl bg-primary/25 opacity-60 blur-2xl transition-opacity group-hover:opacity-90" />
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white glass-panel">
            <AppImage alt="Logo RTCR" className="h-full w-full object-contain p-6" src={rtcrLogoSrc} />
            <div
              className={`absolute left-4 top-4 flex items-center gap-2 rounded-xl px-3 py-1 transition-colors ${
                isLive ? "bg-secondary" : "bg-white/95"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isLive ? "animate-pulse bg-white" : "bg-secondary"
                }`}
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  isLive ? "text-white" : "text-secondary"
                }`}
              >
                En direct
              </span>
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
            <a href="tel:+243994700510" aria-label="Appeler la station" className="text-on-surface-variant transition-transform hover:text-primary active:scale-90">
              <Icon name="call" className="text-[28px]" />
            </a>
            <button
              onClick={toggle}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-600 text-white transition-transform neon-glow active:scale-95"
              aria-label={playing ? "Pause" : "Lecture"}
            >
              <Icon name={loading ? "hourglass_empty" : playing ? "pause" : "play_arrow"} filled className="text-[44px]" />
            </button>
            <a href="mailto:r_tv_la_reference96mhz@yahoo.com" aria-label="Envoyer un e-mail" className="text-on-surface-variant transition-transform hover:text-primary active:scale-90">
              <Icon name="mail" className="text-[28px]" />
            </a>
          </div>
          <div className="space-y-4 rounded-xl border bg-surface-container-low p-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMuted(!muted)}
                aria-label={muted ? "Réactiver le son" : "Couper le son"}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-on-surface"
              >
                <Icon name={muted || volume === 0 ? "volume_off" : "volume_up"} />
              </button>
              <input
                aria-label="Volume"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                type="range"
                min={0}
                max={100}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-surface-container-highest accent-primary"
              />
              <span className="w-10 text-right text-xs font-semibold text-on-surface-variant">{muted ? "Muet" : `${volume}%`}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["auto", "standard"] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest ${quality === q ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}
                >
                  {q === "auto" ? "Qualité auto" : "Standard"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => update("autoReconnect", !settings.autoReconnect)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold ${settings.autoReconnect ? "bg-primary/15 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}
            >
              <span>Reprise après perte de connexion</span>
              <Icon name={settings.autoReconnect ? "toggle_on" : "toggle_off"} filled={settings.autoReconnect} />
            </button>
          </div>

          <p className="text-center text-[11px] text-on-surface-variant">
            Flux radio en direct fourni par Zeno.FM · stream.zeno.fm/cgxrxyyhjsrtv
          </p>
        </div>
      </main>

      <div className="fixed bottom-28 right-4 z-50 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)]">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="WhatsApp"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition hover:bg-emerald-600"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-sm p-0">
            <div className="space-y-4 rounded-2xl bg-background p-5">
              <p className="text-sm font-semibold text-on-surface-variant">
                Les podcasts seront disponibles sous peu.
              </p>
              <WhatsAppComposer />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Chat direct"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition hover:bg-primary/90"
            >
              <Icon name="chat_bubble" className="text-[26px]" />
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-sm p-0">
            <LiveChat />
          </DialogContent>
        </Dialog>
      </div>

      <BottomNav />
    </div>
  );
}
