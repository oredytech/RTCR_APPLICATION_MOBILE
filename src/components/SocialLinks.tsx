import { Icon } from "./Icon";

const SOCIALS = [
  {
    label: "Facebook",
    icon: "public",
    url: "https://www.facebook.com/rtcreference",
    color: "bg-[#1877F2] text-white",
  },
  {
    label: "YouTube",
    icon: "smart_display",
    url: "https://www.youtube.com/@RTC.la.reference",
    color: "bg-[#FF0000] text-white",
  },
  {
    label: "TikTok",
    icon: "music_note",
    url: "https://www.tiktok.com/@radio.tl..com..la?_t=8rHSjmPNMeN&_r=1",
    color: "bg-black text-white",
  },
];

export function SocialLinks() {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-bold">Suivez-nous</h2>
      <div className="grid grid-cols-3 gap-2">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 font-semibold transition-transform active:scale-95 ${s.color}`}
          >
            <Icon name={s.icon} filled className="text-[24px]" />
            <span className="text-xs">{s.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
