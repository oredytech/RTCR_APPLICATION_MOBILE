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
  error: string | null;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (v: number) => void;
};

const RadioContext = createContext<Ctx | null>(null);

export function RadioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();

  // Create audio element lazily on client.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio(STREAM_URL);
    a.preload = "none";
    a.crossOrigin = "anonymous";
    a.volume = volume / 100;
    audioRef.current = a;
    const onPlay = () => { setPlaying(true); setLoading(false); };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => { setLoading(false); setError(null); };
    const onError = () => { setError("Lecture impossible. Vérifiez votre connexion."); setLoading(false); setPlaying(false); };
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("error", onError);
    return () => {
      a.pause();
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("error", onError);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    setLoading(true);
    setError(null);
    a.src = STREAM_URL + "?t=" + Date.now();
    a.play().catch(() => {
      setError("Lecture impossible. Touchez à nouveau pour réessayer.");
      setLoading(false);
    });
  }, []);

  const pause = useCallback(() => {
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

  const setVolume = useCallback((v: number) => setVolumeState(Math.max(0, Math.min(100, v))), []);

  const value = useMemo(
    () => ({ playing, loading, volume, error, toggle, play, pause, setVolume }),
    [playing, loading, volume, error, toggle, play, pause, setVolume],
  );

  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>;
}

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used within RadioProvider");
  return ctx;
}
