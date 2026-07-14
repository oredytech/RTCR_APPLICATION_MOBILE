import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { useSettings, type Theme } from "@/lib/settings-context";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Paramètres — RTCR" },
      { name: "description", content: "Personnalisez votre expérience RTCR : thème, notifications, réveil et cookies." },
    ],
  }),
  component: SettingsPage,
});

function Row({
  icon,
  title,
  desc,
  children,
}: {
  icon: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon name={icon} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-on-surface">{title}</p>
        {desc && <p className="text-xs text-on-surface-variant">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-surface-container-highest"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-[22px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}

async function requestNotifPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const p = await Notification.requestPermission();
  return p === "granted";
}

function SettingsPage() {
  const { settings, update, reset } = useSettings();

  const clearAllData = () => {
    if (!confirm("Effacer toutes les données locales (paramètres, cache, cookies) ?")) return;
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        const eq = c.indexOf("=");
        const name = (eq > -1 ? c.substr(0, eq) : c).trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    } catch {}
    reset();
    alert("Données effacées.");
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-on-surface-variant">Personnalisez RTCR selon vos préférences.</p>
        </section>

        <section className="space-y-2">
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Apparence
          </h2>
          <div className="rounded-2xl p-2 glass-card">
            <Row icon="palette" title="Thème" desc="Choisissez l'apparence de l'application">
              <div className="flex overflow-hidden rounded-lg border">
                {(["light", "dark", "system"] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => update("theme", t)}
                    className={`px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${settings.theme === t ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high"}`}
                  >
                    {t === "light" ? "Clair" : t === "dark" ? "Sombre" : "Auto"}
                  </button>
                ))}
              </div>
            </Row>
            <Row icon="animation" title="Réduire les animations" desc="Moins de mouvements à l'écran">
              <Toggle label="Réduire les animations" value={settings.reduceMotion} onChange={(v) => update("reduceMotion", v)} />
            </Row>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Radio
          </h2>
          <div className="rounded-2xl p-2 glass-card">
            <Row icon="play_circle" title="Lecture automatique" desc="Démarrer la radio au lancement de l'app">
              <Toggle label="Lecture automatique" value={settings.autoplayRadio} onChange={(v) => update("autoplayRadio", v)} />
            </Row>
            <Row icon="data_saver_on" title="Économiseur de données" desc="Charge les images en basse qualité">
              <Toggle label="Économiseur de données" value={settings.dataSaver} onChange={(v) => update("dataSaver", v)} />
            </Row>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Notifications
          </h2>
          <div className="rounded-2xl p-2 glass-card">
            <Row icon="notifications" title="Autoriser les notifications" desc="Alertes de la station et rappels">
              <Toggle
                label="Notifications"
                value={settings.notifications}
                onChange={async (v) => {
                  if (v) {
                    const ok = await requestNotifPermission();
                    update("notifications", ok);
                    if (!ok) alert("Veuillez autoriser les notifications dans votre navigateur.");
                  } else {
                    update("notifications", false);
                  }
                }}
              />
            </Row>
            <Row icon="campaign" title="Actualités urgentes" desc="Recevoir les alertes d'information">
              <Toggle label="Actualités urgentes" value={settings.breakingAlerts} onChange={(v) => update("breakingAlerts", v)} />
            </Row>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Réveil
          </h2>
          <div className="rounded-2xl p-2 glass-card">
            <Row icon="alarm" title="Réveil radio" desc="Lancer RTCR chaque matin à l'heure choisie">
              <Toggle label="Réveil" value={settings.alarmEnabled} onChange={(v) => update("alarmEnabled", v)} />
            </Row>
            <Row icon="schedule" title="Heure du réveil" desc="Format 24h">
              <input
                type="time"
                value={settings.alarmTime}
                onChange={(e) => update("alarmTime", e.target.value)}
                className="rounded-lg border bg-surface-container px-2 py-1 text-sm text-on-surface"
              />
            </Row>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Cookies & confidentialité
          </h2>
          <div className="rounded-2xl p-2 glass-card">
            <Row icon="analytics" title="Cookies analytiques" desc="Nous aider à améliorer l'app">
              <Toggle label="Cookies analytiques" value={settings.cookiesAnalytics} onChange={(v) => { update("cookiesAnalytics", v); update("cookiesConsentGiven", true); }} />
            </Row>
            <Row icon="local_offer" title="Cookies marketing" desc="Personnalisation des contenus sponsorisés">
              <Toggle label="Cookies marketing" value={settings.cookiesMarketing} onChange={(v) => { update("cookiesMarketing", v); update("cookiesConsentGiven", true); }} />
            </Row>
          </div>
          <div className="flex flex-col gap-2 px-2 text-sm">
            <Link to="/privacy" className="text-primary hover:underline">
              Politique de confidentialité →
            </Link>
            <Link to="/terms" className="text-primary hover:underline">
              Conditions d'utilisation →
            </Link>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Données
          </h2>
          <div className="rounded-2xl p-2 glass-card">
            <button
              onClick={reset}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-surface-container-high"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon name="restart_alt" />
              </div>
              <div>
                <p className="text-sm font-semibold">Réinitialiser les paramètres</p>
                <p className="text-xs text-on-surface-variant">Rétablir les valeurs par défaut</p>
              </div>
            </button>
            <button
              onClick={clearAllData}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-surface-container-high"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                <Icon name="delete_forever" />
              </div>
              <div>
                <p className="text-sm font-semibold">Effacer toutes les données</p>
                <p className="text-xs text-on-surface-variant">Cookies, cache et paramètres</p>
              </div>
            </button>
          </div>
        </section>

        <section className="rounded-2xl p-4 glass-card text-center text-xs text-on-surface-variant">
          <p>RTCR — Radio Télévision Communautaire la Référence</p>
          <p>Version 1.0.0 · Komanda, RDC</p>
        </section>
      </div>
    </AppShell>
  );
}
