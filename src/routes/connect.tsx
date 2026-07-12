import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "News & Connect — SoundStream" },
      { name: "description", content: "Latest music news and ways to connect with the SoundStream community." },
    ],
  }),
  component: ConnectPage,
});

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
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Latest News</h2>
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              March 2024
            </span>
          </div>
          <div className="space-y-4">
            <article className="group overflow-hidden rounded-2xl glass-card transition-all hover:border-primary/30">
              <div className="relative h-56 w-full">
                <img
                  alt="Studio at night"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrMOcZJn1aMcQllAOUD0WRLgGprnC7DuIRHjbylaxA5ajcelq6ZCtZO8-wmbhdbpLZ_yhOl_PV49KPZRqMuyIK-q29cpuHbg1vMW60GqUtC_R7a3rra_qkTUv1MjaNBHNQ5Wp4u6hcuz-KNQtEDNUKN_DtoyjYmZ_jzVWmR0RUa5KypwnDL-FFKTHYoF7Z5uzD1fws9TBng5hiYVt61xxEz2XnCoSKA5GGHgmcc5g3ggI6nP1nNnV4"
                />
                <div className="absolute left-4 top-4 rounded bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-primary">
                  Exclusive
                </div>
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">
                  The Future of Spatial Audio: SoundStream's New Lab
                </h3>
                <p className="line-clamp-2 text-on-surface-variant">
                  Exploring how generative AI and binaural recording are reshaping the way we
                  experience live radio broadcasts in 2024.
                </p>
                <div className="mt-4 flex items-center gap-2 font-semibold text-primary">
                  <span className="text-xs uppercase tracking-widest">Read more</span>
                  <Icon name="arrow_forward" className="text-sm" />
                </div>
              </div>
            </article>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="flex flex-col gap-3 rounded-2xl p-4 glass-card">
                <div className="h-32 overflow-hidden rounded-lg">
                  <img
                    alt="Vintage guitar"
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEu9Gm4yKGiWQK9G1LBhmgH0SqMhBXuqFS2FT6MN0G78C_BH2x1VOmY5y85h8qHO_tPjzbfX6sd6ygoJI_oQQZggQVPF__RxR0vlkFXLYgpfYRtLhcziNnkUFWBDuVP2R3oPIVY9UWKAJD1ebV_1Lz8jfQcDA81lINH8dzuYl3SDWoI07GVMT5RwG6ciepInzZIjpoG5WTTRMZb_5rh0wtwhPony0QbVPTr5AGXrHbbNzeNpYcGY7B"
                  />
                </div>
                <h4 className="font-bold">Top 10 Indie Tracks of the Week</h4>
                <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                  4 min read
                </span>
              </article>
              <article className="flex flex-col gap-3 rounded-2xl p-4 glass-card">
                <div className="h-32 overflow-hidden rounded-lg">
                  <img
                    alt="Sound waves"
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM8w-mWspQMqGLV0X4Mzf6uY6Bh_hfzmQVWuR0qHZqd39eoU4rFgW1OeBKaH2os35aJQO7l8RLoOVMJatNZxHFVdlucczc4Bld6wiIbmcyY3twAeLwJMDJGH4gZquWTmYoO9IdYRpxnda-ZY93KexrURxMlgTpA-9TdMoppU3ZvQyFdozvs_yn15S2wfT1icLG20xUQFQSp95_DdLDGQu3uZPzn7zS4xR0sqzEcuGyznr9nfEy53dN"
                  />
                </div>
                <h4 className="font-bold">Podcast: Inside the DJ Booth</h4>
                <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                  12 min audio
                </span>
              </article>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl p-5 glass-card">
          <h2 className="mb-2 text-2xl font-bold">Connect with Us</h2>
          <p className="mb-5 text-on-surface-variant">
            Join the conversation. We're live 24/7 and love hearing from our listeners.
          </p>
          <div className="mb-6 flex gap-3">
            {["share", "forum", "podcasts"].map((n) => (
              <a
                key={n}
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 text-on-surface-variant transition-all hover:border-primary hover:text-primary active:scale-90"
              >
                <Icon name={n} />
              </a>
            ))}
          </div>
          <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-semibold text-on-primary transition-opacity active:opacity-90">
            <Icon name="call" />
            Call the Station
          </button>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="msg"
                className="mb-2 block text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
              >
                Your Message
              </label>
              <textarea
                id="msg"
                required
                className="h-32 w-full rounded-xl border-none bg-surface-container p-4 text-on-surface transition-all placeholder:text-outline focus:ring-2 focus:ring-primary"
                placeholder="Tell us what's on your mind..."
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
              {sent ? "Message Sent!" : "Send Message"}
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
