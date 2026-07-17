import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type RadioQuality = "auto" | "standard";
export type ArticleFontSize = "small" | "normal" | "large" | "xlarge";
export type ArticleTheme = "default" | "light" | "sepia" | "dark";
export type ArticleColumn = "compact" | "comfortable" | "wide";

export type Settings = {
  theme: Theme;
  notifications: boolean;
  breakingAlerts: boolean;
  notifyLive: boolean;
  notifyPrograms: boolean;
  notifyCommunity: boolean;
  chatSoundEnabled: boolean;
  autoplayRadio: boolean;
  autoReconnect: boolean;
  radioQuality: RadioQuality;
  radioMuted: boolean;
  radioVolume: number;
  dataSaver: boolean;
  language: "fr";
  cookiesAnalytics: boolean;
  cookiesMarketing: boolean;
  cookiesConsentGiven: boolean;
  alarmEnabled: boolean;
  alarmTime: string; // HH:MM
  reduceMotion: boolean;
  articleFontSize: ArticleFontSize;
  articleTheme: ArticleTheme;
  articleColumn: ArticleColumn;
};

const DEFAULTS: Settings = {
  theme: "light",
  notifications: false,
  breakingAlerts: true,
  notifyLive: true,
  notifyPrograms: false,
  notifyCommunity: true,
  chatSoundEnabled: true,
  autoplayRadio: false,
  autoReconnect: true,
  radioQuality: "auto",
  radioMuted: false,
  radioVolume: 70,
  dataSaver: false,
  language: "fr",
  cookiesAnalytics: false,
  cookiesMarketing: false,
  cookiesConsentGiven: false,
  alarmEnabled: false,
  alarmTime: "06:30",
  reduceMotion: false,
  articleFontSize: "normal",
  articleTheme: "default",
  articleColumn: "comfortable",
};

const KEY = "rtcr.settings.v1";

type Ctx = {
  settings: Settings;
  update: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  reset: () => void;
};

const SettingsContext = createContext<Ctx | null>(null);

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const wantDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", wantDark);
  root.classList.toggle("light", !wantDark);
}

function applyMotionPreference(reduceMotion: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("reduce-motion", reduceMotion);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  // Load from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = { ...DEFAULTS, ...JSON.parse(raw) } as Settings;
        setSettings(parsed);
        applyTheme(parsed.theme);
        applyMotionPreference(parsed.reduceMotion);
      } else {
        applyTheme(DEFAULTS.theme);
        applyMotionPreference(DEFAULTS.reduceMotion);
      }
    } catch {
      applyTheme(DEFAULTS.theme);
      applyMotionPreference(DEFAULTS.reduceMotion);
    }
  }, []);

  // Listen to system theme changes when in "system" mode.
  useEffect(() => {
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [settings.theme]);

  const update = useCallback(
    <K extends keyof Settings>(k: K, v: Settings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [k]: v };
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {}
        if (k === "theme") applyTheme(v as Theme);
        if (k === "reduceMotion") applyMotionPreference(Boolean(v));
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    setSettings(DEFAULTS);
    applyTheme(DEFAULTS.theme);
    applyMotionPreference(DEFAULTS.reduceMotion);
  }, []);

  const value = useMemo(() => ({ settings, update, reset }), [settings, update, reset]);

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
