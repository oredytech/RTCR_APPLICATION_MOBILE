import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { SocialLinks } from "@/components/SocialLinks";
import { WhatsAppComposer } from "@/components/WhatsAppComposer";

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

const CONTACTS: Array<{ icon: string; label: string; value: string; href?: string }> = [
  { icon: "location_on", label: "Adresse", value: "Komanda, Q. Base II — République démocratique du Congo" },
  {
    icon: "call",
    label: "Téléphone",
    value: "+243 994 700 510",
    href: "tel:+243994700510",
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
    icon: "mail",
    label: "E-mail (bis)",
    value: "rtvlareference@gmail.com",
    href: "mailto:rtvlareference@gmail.com",
  },
  {
    icon: "schedule",
    label: "Horaires",
    value: "Lun–Ven 04:50–21:00 · en ligne 24h/7",
  },
];

function ConnectPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedName = name.trim() || "Anonyme";
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const subject = encodeURIComponent(`Message RTCR de ${trimmedName}`);
    const body = encodeURIComponent(`Nom : ${trimmedName}\n\nMessage : ${trimmedMessage}`);
    window.location.href = `mailto:rtvlareference@gmail.com?subject=${subject}&body=${body}`;

    setSent(true);
    setName("");
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <AppShell>
      <div className="space-y-10">
        <section className="rounded-2xl p-5 glass-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Contact
              </span>
              <h1 className="text-2xl font-bold">Nous contacter</h1>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-xl bg-surface-container-high px-3 py-2 text-sm font-semibold text-on-surface"
            >
              <Icon name="info" className="text-[18px]" />
              À propos
            </Link>
          </div>
          <p className="text-on-surface-variant">
            Vous souhaitez prendre contact avec RTCR ? Utilisez nos coordonnées, WhatsApp ou envoyez-nous un message.
          </p>
        </section>

        <WhatsAppComposer />

        <SocialLinks />

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
            href="tel:+243994700510"
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
