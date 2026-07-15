import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { ensureNotificationPermission, getNotificationPermission, showLocalNotification } from "@/lib/notification-manager";
import {
  useSettings,
  type ArticleColumn,
  type ArticleFontSize,
  type ArticleTheme,
  type RadioQuality,
  type Theme,
} from "@/lib/settings-context";

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
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 rounded-xl p-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon name={icon} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-on-surface">{title}</p>
        {desc && <p className="text-xs text-on-surface-variant">{desc}</p>}
      </div>
      <div className="flex justify-start sm:justify-end">{children}</div>
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
      className={`relative h-8 w-14 rounded-full transition-colors ${value ? "bg-primary" : "bg-surface-container-highest"}`}
    >
      <span
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap overflow-hidden rounded-lg border">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-3 py-1.5 text-xs font-semibold transition-colors ${value === option.value ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SettingsPage() {
  const { settings, update, reset } = useSettings();
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported");
  const [permissionMessage, setPermissionMessage] = useState("Vérification des autorisations…");

  useEffect(() => {
    const current = getNotificationPermission();
    setPermission(current);
    setPermissionMessage(current === "granted" ? "Autorisé sur cet appareil." : current === "denied" ? "Bloqué par le navigateur." : current === "default" ? "Autorisation non demandée." : "Non pris en charge par ce navigateur.");
  }, []);

  const enableNotifications = async () => {
    const result = await ensureNotificationPermission();
    setPermission(result.permission);
    setPermissionMessage(result.message);
    update("notifications", result.permission === "granted");
    if (result.permission === "granted") showLocalNotification("RTCR", "Les notifications sont activées.", "/settings");
  };

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
                <Segmented<Theme>
                  value={settings.theme}
                  onChange={(v) => update("theme", v)}
                  options={[{ value: "light", label: "Clair" }, { value: "dark", label: "Sombre" }, { value: "system", label: "Auto" }]}
                />
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
            <Row icon="settings_input_antenna" title="Reprise automatique" desc="Relancer le direct après une coupure réseau">
              <Toggle label="Reprise automatique" value={settings.autoReconnect} onChange={(v) => update("autoReconnect", v)} />
            </Row>
            <Row icon="high_quality" title="Qualité du flux" desc="La station fournit actuellement un flux principal Zeno.FM">
              <Segmented<RadioQuality>
                value={settings.radioQuality}
                onChange={(v) => update("radioQuality", v)}
                options={[{ value: "auto", label: "Auto" }, { value: "standard", label: "Standard" }]}
              />
            </Row>
            <Row icon="volume_up" title="Volume par défaut" desc="Conservé sur cet appareil">
              <div className="flex min-w-44 items-center gap-2">
                <input aria-label="Volume par défaut" type="range" min={0} max={100} value={settings.radioVolume} onChange={(e) => update("radioVolume", Number(e.target.value))} className="h-1 flex-1 accent-primary" />
                <span className="w-10 text-right text-xs font-semibold text-on-surface-variant">{settings.radioVolume}%</span>
              </div>
            </Row>
            <Row icon="volume_off" title="Son coupé au démarrage" desc="Bouton muet persistant du lecteur">
              <Toggle label="Son coupé" value={settings.radioMuted} onChange={(v) => update("radioMuted", v)} />
            </Row>
            <Row icon="data_saver_on" title="Économiseur de données" desc="Charge les images en basse qualité">
              <Toggle label="Économiseur de données" value={settings.dataSaver} onChange={(v) => update("dataSaver", v)} />
            </Row>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Lecture des actualités
          </h2>
          <div className="rounded-2xl p-2 glass-card">
            <Row icon="format_size" title="Taille de police" desc="Confort de lecture des articles">
              <Segmented<ArticleFontSize>
                value={settings.articleFontSize}
                onChange={(v) => update("articleFontSize", v)}
                options={[{ value: "small", label: "Petite" }, { value: "normal", label: "Normale" }, { value: "large", label: "Grande" }, { value: "xlarge", label: "Très grande" }]}
              />
            </Row>
            <Row icon="article" title="Thème article" desc="Indépendant du thème général si souhaité">
              <Segmented<ArticleTheme>
                value={settings.articleTheme}
                onChange={(v) => update("articleTheme", v)}
                options={[{ value: "default", label: "App" }, { value: "light", label: "Clair" }, { value: "sepia", label: "Sépia" }, { value: "dark", label: "Sombre" }]}
              />
            </Row>
            <Row icon="width" title="Largeur de colonne" desc="Ajuste l'espace de lecture">
              <Segmented<ArticleColumn>
                value={settings.articleColumn}
                onChange={(v) => update("articleColumn", v)}
                options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Confort" }, { value: "wide", label: "Large" }]}
              />
            </Row>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Notifications
          </h2>
          <div className="rounded-2xl p-2 glass-card">
            <div className="m-2 rounded-xl bg-surface-container-low p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon name="verified_user" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Autorisations notifications</p>
                  <p className="text-xs text-on-surface-variant">{permissionMessage}</p>
                </div>
                <span className="rounded-full bg-surface-container-high px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">{permission === "granted" ? "OK" : permission === "denied" ? "Bloqué" : "À valider"}</span>
              </div>
              <button type="button" onClick={enableNotifications} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary">
                <Icon name="notifications_active" className="text-[18px]" />
                Demander l'autorisation
              </button>
            </div>
            <Row icon="notifications" title="Notifications" desc="Activer ou désactiver toutes les alertes RTCR">
              <Toggle label="Notifications" value={settings.notifications} onChange={(v) => v ? enableNotifications() : update("notifications", false)} />
            </Row>
            <Row icon="campaign" title="Actualités urgentes" desc="Recevoir les alertes d'information">
              <Toggle label="Actualités urgentes" value={settings.breakingAlerts} onChange={(v) => update("breakingAlerts", v)} />
            </Row>
            <Row icon="radio" title="Direct radio" desc="Début d'émission, reprise d'antenne et directs spéciaux">
              <Toggle label="Direct radio" value={settings.notifyLive} onChange={(v) => update("notifyLive", v)} />
            </Row>
            <Row icon="event" title="Programmes" desc="Rappels d'émissions et rendez-vous importants">
              <Toggle label="Programmes" value={settings.notifyPrograms} onChange={(v) => update("notifyPrograms", v)} />
            </Row>
            <Row icon="groups" title="Communauté" desc="Annonces locales et activités communautaires">
              <Toggle label="Communauté" value={settings.notifyCommunity} onChange={(v) => update("notifyCommunity", v)} />
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
            <Link
              to="/history"
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-surface-container-high"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon name="history" />
              </div>
              <div>
                <p className="text-sm font-semibold">Historique et articles hors-ligne</p>
                <p className="text-xs text-on-surface-variant">Lectures récentes, sauvegardes et créateur de l'app</p>
              </div>
            </Link>
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
          <p>Version 1.0.0 · Komanda, RDC · Créée par <a href="https://oredytech.com" target="_blank" rel="noreferrer" className="text-primary underline">Oredy TECHNOLOGIES</a></p>
        </section>
      </div>
    </AppShell>
  );
}
