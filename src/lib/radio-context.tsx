import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSettings } from "./settings-context";

export const STREAM_URL = "https://stream.zeno.fm/cgxrxyyhjsrtv";

type Ctx = {
  playing: boolean;
  loading: boolean;
  volume: number;
  muted: boolean;
  quality: "auto" | "standard";
  title: string;
  error: string | null;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (v: number) => void;
  setMuted: (v: boolean) => void;
  setQuality: (v: "auto" | "standard") => void;
};

const RadioContext = createContext<Ctx | null>(null);

export function RadioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const autoReconnectRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [muted, setMutedState] = useState(false);
  const [title, setTitle] = useState("RTCR Radio 96.0 Mhz");
  const [error, setError] = useState<string | null>(null);
  const { settings, update } = useSettings();

  useEffect(() => {
    autoReconnectRef.current = settings.autoReconnect;
  }, [settings.autoReconnect]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    setVolumeState(settings.radioVolume);
    setMutedState(settings.radioMuted);
  }, [settings.radioMuted, settings.radioVolume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (reconnectTimerRef.current) window.clearTimeout(reconnectTimerRef.current);
    setLoading(true);
    setError(null);
    a.src = STREAM_URL + "?t=" + Date.now();
    a.play().catch(() => {
      setError("Lecture impossible. Touchez à nouveau pour réessayer.");
      setLoading(false);
    });
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (typeof window === "undefined") return;
    if (reconnectTimerRef.current) window.clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = window.setTimeout(() => {
      reconnectTimerRef.current = null;
      if (autoReconnectRef.current) play();
    }, 5000);
  }, [play]);

  // Create audio element lazily on client.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio(STREAM_URL);
    a.preload = "none";
    a.crossOrigin = "anonymous";
    a.volume = volume / 100;
    a.muted = muted;
    audioRef.current = a;
    const onPlay = () => { setPlaying(true); setLoading(false); };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => { setLoading(false); setError(null); };
    const onStalled = () => {
      if (!autoReconnectRef.current) return;
      setError("Connexion instable. Reprise automatique…");
      scheduleReconnect();
    };
    const onLoadedMetadata = () => {
      const metaTitle = a?.title?.trim();
      if (metaTitle) setTitle(metaTitle);
    };
    const onError = () => {
      const canReconnect = autoReconnectRef.current;
      setError(canReconnect ? "Connexion perdue. Reprise automatique…" : "Lecture impossible. Vérifiez votre connexion.");
      setLoading(false);
      setPlaying(false);
      if (canReconnect) scheduleReconnect();
    };
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("loadedmetadata", onLoadedMetadata);
    a.addEventListener("stalled", onStalled);
    a.addEventListener("error", onError);
    return () => {
      a.pause();
      if (reconnectTimerRef.current) window.clearTimeout(reconnectTimerRef.current);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("loadedmetadata", onLoadedMetadata);
      a.removeEventListener("stalled", onStalled);
      a.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [scheduleReconnect]);

  const pause = useCallback(() => {
    if (reconnectTimerRef.current) window.clearTimeout(reconnectTimerRef.current);
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, play, pause]);

  // Autoplay after mount if user opted in.
  useEffect(() => {
    if (settings.autoplayRadio && audioRef.current && !playing) {
      // browsers block autoplay without gesture — will fail silently.
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.autoplayRadio]);

  const setVolume = useCallback((v: number) => {
    const next = Math.max(0, Math.min(100, v));
    setVolumeState(next);
    update("radioVolume", next);
    if (next > 0 && muted) {
      setMutedState(false);
      update("radioMuted", false);
    }
  }, [muted, update]);

  const setMuted = useCallback((v: boolean) => {
    setMutedState(v);
    update("radioMuted", v);
  }, [update]);

  const setQuality = useCallback((v: "auto" | "standard") => {
    update("radioQuality", v);
    if (playing) {
      pause();
      setTimeout(play, 100);
    }
  }, [pause, play, playing, update]);

  const value = useMemo(
    () => ({ playing, loading, volume, muted, quality: settings.radioQuality, title, error, toggle, play, pause, setVolume, setMuted, setQuality }),
    [playing, loading, volume, muted, settings.radioQuality, title, error, toggle, play, pause, setVolume, setMuted, setQuality],
  );

  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
}

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used within RadioProvider");
  return ctx;
}
