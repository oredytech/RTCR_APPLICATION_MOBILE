import logoAsset from "@/assets/logo_rtcr.webp.asset.json";
import { Icon } from "./Icon";

export function TopBar({
  title = "RTCR",
  subtitle = "96.0 Mhz · Canal 6",
  showAvatar = false,
}: {
  title?: string;
  subtitle?: string;
  showAvatar?: boolean;
}) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-surface/80 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-0.5">
          <img
            src={logoAsset.url}
            alt="Logo RTCR"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-headline text-lg font-extrabold tracking-tight text-primary">
            {title}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
            {subtitle}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="tel:+243812875481"
          aria-label="Appeler la station"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:text-primary"
        >
          <Icon name="call" />
        </a>
        {showAvatar && (
          <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/20 bg-white">
            <img
              alt="RTCR"
              className="h-full w-full object-contain"
              src={logoAsset.url}
            />
          </div>
        )}
      </div>
    </header>
  );
}
