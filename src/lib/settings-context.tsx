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

export type Settings = {
  theme: Theme;
  notifications: boolean;
  breakingAlerts: boolean;
  autoplayRadio: boolean;
  dataSaver: boolean;
  language: "fr";
  cookiesAnalytics: boolean;
  cookiesMarketing: boolean;
  cookiesConsentGiven: boolean;
  alarmEnabled: boolean;
  alarmTime: string; // HH:MM
  reduceMotion: boolean;
};

const DEFAULTS: Settings = {
  theme: "light",
  notifications: false,
  breakingAlerts: true,
  autoplayRadio: false,
  dataSaver: false,
  language: "fr",
  cookiesAnalytics: false,
  cookiesMarketing: false,
  cookiesConsentGiven: false,
  alarmEnabled: false,
  alarmTime: "06:30",
  reduceMotion: false,
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
      } else {
        applyTheme(DEFAULTS.theme);
      }
    } catch {
      applyTheme(DEFAULTS.theme);
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
