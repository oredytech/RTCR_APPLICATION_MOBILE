import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import logoAsset from "@/assets/logo_rtcr.webp.asset.json";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "À propos & Contact — RTCR" },
      {
        name: "description",
        content:
          "À propos de RTCR, nos services et nos coordonnées. Radio Télévision Communautaire la Référence — Komanda, RDC.",
      },
    ],
  }),
  component: ConnectPage,
});

const SERVICES = [
  {
    icon: "radio",
    title: "Diffusion radiophonique FM",
    desc: "Notre service garantit une diffusion claire, fiable et qualitative pour les auditeurs. Faites confiance à notre expertise pour un rayonnement optimal de votre contenu sonore.",
  },
  {
    icon: "videocam",
    title: "Couverture médiatique audio-visuelle des activités",
    desc: "Nous fournissons un service de couverture médiatique audio-visuelle complet et professionnel pour documenter et promouvoir vos activités. Notre équipe expérimentée capture sons, images et vidéos de haute qualité, réalise des interviews saisissantes et compile des reportages engageants qui mettent en valeur chaque moment clé de l'activité. Avec une expertise dans diverses plateformes médiatiques, nous garantissons une diffusion optimale pour atteindre votre public cible. Faites rayonner vos évènements grâce à notre expertise en communication audio-visuelle.",
  },
  {
    icon: "share",
    title: "Diffusion et publication sur les réseaux sociaux",
    desc: "Nous proposons un service professionnel de diffusion et publication sur les réseaux sociaux afin d'assurer une présence et une visibilité optimales de votre activité en ligne, grâce à des stratégies adaptées à vos objectifs et publics cibles.",
  },
];

const CONTACTS: Array<{ icon: string; label: string; value: string; href?: string }> = [
  { icon: "location_on", label: "Adresse", value: "Komanda, Q. Base II — République démocratique du Congo" },
  {
    icon: "call",
    label: "Téléphone",
    value: "+243 812 875 481",
    href: "tel:+243812875481",
  },
  {
    icon: "call",
    label: "Téléphone (bis)",
    value: "+243 812 875 481",
    href: "tel:+243812875481",
  },
  {
    icon: "mail",
    label: "E-mail",
    value: "r_tv_la_reference96mhz@yahoo.com",
    href: "mailto:r_tv_la_reference96mhz@yahoo.com",
  },
  {
    icon: "schedule",
    label: "Horaires",
    value: "Lun–Ven 04:50–21:00 · en ligne 24h/7",
  },
];

function ConnectPage() {
  const [sent, setSent] = useState(false);
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    (e.currentTarget as HTMLFormElement).reset();
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <AppShell>
      <div className="space-y-10">
        <section className="overflow-hidden rounded-2xl p-5 glass-card">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-white p-1">
              <img
                src={logoAsset.url}
                alt="Logo RTCR"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                À propos
              </span>
              <h1 className="text-2xl font-bold">RTCR</h1>
              <p className="text-xs text-on-surface-variant">
                Unité · Travail · Développement
              </p>
            </div>
          </div>
          <p className="text-on-surface-variant">
            <span className="font-semibold text-on-surface">
              Radio Télévision Communautaire la Référence
            </span>{" "}
            est dédiée à fournir des informations fiables, soutenir les
            initiatives communautaires afin de créer des liens et de renforcer
            la communauté grâce à des programmes pertinents et engageants.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Nos services</h2>
          <div className="space-y-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl p-4 glass-card transition-colors hover:border-primary/30"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon name={s.icon} filled />
                  </div>
                  <h3 className="font-bold leading-tight">{s.title}</h3>
                </div>
                <p className="text-sm text-on-surface-variant">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Contacts</h2>
          <div className="space-y-2 rounded-2xl p-4 glass-card">
            {CONTACTS.map((c, i) => {
              const content = (
                <div className="flex items-start gap-3 py-2">
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon name={c.icon} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                      {c.label}
                    </p>
                    <p className="text-sm font-medium text-on-surface">
                      {c.value}
                    </p>
                  </div>
                </div>
              );
              return c.href ? (
                <a
                  key={i}
                  href={c.href}
                  className="block rounded-lg transition-colors hover:bg-white/5"
                >
                  {content}
                </a>
              ) : (
                <div key={i}>{content}</div>
              );
            })}
          </div>
          <a
            href="tel:+243812875481"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-on-primary transition-opacity active:opacity-90"
          >
            <Icon name="call" />
            Appeler la station
          </a>
        </section>

        <section className="rounded-2xl p-5 glass-card">
          <h2 className="mb-2 text-2xl font-bold">Écrivez-nous</h2>
          <p className="mb-5 text-on-surface-variant">
            Une question, une réaction, une demande de couverture ? Envoyez-nous
            un message.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                Votre nom
              </label>
              <input
                id="name"
                required
                className="w-full rounded-xl border-none bg-surface-container p-4 text-on-surface transition-all placeholder:text-outline focus:ring-2 focus:ring-primary"
                placeholder="Nom & prénom"
              />
            </div>
            <div>
              <label
                htmlFor="msg"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                Votre message
              </label>
              <textarea
                id="msg"
                required
                className="h-32 w-full rounded-xl border-none bg-surface-container p-4 text-on-surface transition-all placeholder:text-outline focus:ring-2 focus:ring-primary"
                placeholder="Dites-nous ce qui vous préoccupe…"
              />
            </div>
            <button
              type="submit"
              className={`w-full rounded-xl border py-3 font-semibold transition-all active:scale-95 ${
                sent
                  ? "border-primary bg-primary text-on-primary"
                  : "border-white/20 text-on-surface hover:bg-white/5"
              }`}
            >
              {sent ? "Message envoyé !" : "Envoyer le message"}
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
