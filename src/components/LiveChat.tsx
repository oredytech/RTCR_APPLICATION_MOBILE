import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSettings } from "@/lib/settings-context";
import { showLocalNotification } from "@/lib/notification-manager";
import { Icon } from "./Icon";

type Msg = { id: string; name: string; text: string; ts: number };

const NAME_KEY = "rtcr.livechat.name.v1";
const API_URL = "/api/chat";
const POLL_INTERVAL = 4000;
const MAX = 100;

async function fetchMessages(): Promise<Msg[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as Msg[];
}

export function LiveChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useSettings();
  const lastSeenRef = useRef<number>(0);

  useEffect(() => {
    setName(window.localStorage.getItem(NAME_KEY) ?? "");

    let ignore = false;
    const load = async () => {
      const serverMessages = await fetchMessages();
      if (!ignore) {
        const nextMessages = serverMessages.slice(-MAX);
        const latest = nextMessages[nextMessages.length - 1]?.ts ?? 0;
        if (nextMessages.length > 0 && latest > lastSeenRef.current && messages.length > 0) {
          if (settings.notifications) {
            const newest = nextMessages[nextMessages.length - 1];
            showLocalNotification("Nouveau message", `${newest.name} : ${newest.text}`.slice(0, 120), "/live");
          }
        }
        lastSeenRef.current = latest;
        setMessages(nextMessages);
      }
    };

    load();
    const interval = window.setInterval(load, POLL_INTERVAL);
    return () => {
      ignore = true;
      window.clearInterval(interval);
    };
  }, [messages.length, settings.notifications]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    const n = (name.trim() || "Anonyme").slice(0, 24);
    if (!t) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: n, text: t.slice(0, 500) }),
    });

    if (!res.ok) return;
    const msg = (await res.json()) as Msg;
    setMessages((prev) => [...prev, msg].slice(-MAX));
    window.localStorage.setItem(NAME_KEY, n);
    setText("");
  }

  return (
    <section className="w-full max-w-sm rounded-xl border bg-surface-container-low p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Salon en direct</h3>
        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          <Icon name="forum" className="text-[14px]" />
          {messages.length}
        </span>
      </div>
      <div
        ref={scrollRef}
        className="mb-3 h-48 space-y-2 overflow-y-auto rounded-lg bg-surface-container-high/50 p-2 text-sm"
      >
        {messages.length === 0 ? (
          <p className="py-8 text-center text-xs text-on-surface-variant">
            Soyez le premier à écrire dans le salon.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="rounded-lg bg-surface-container-low px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[11px] font-bold text-primary">{m.name}</span>
                <span className="text-[10px] text-on-surface-variant">
                  {new Date(m.ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="break-words text-sm text-on-surface">{m.text}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={send} className="space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre nom"
          maxLength={24}
          className="w-full rounded-lg border-none bg-surface-container-high px-3 py-2 text-sm outline-none placeholder:text-outline focus:ring-2 focus:ring-primary"
        />
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrire un message…"
            maxLength={500}
            className="flex-1 rounded-lg border-none bg-surface-container-high px-3 py-2 text-sm outline-none placeholder:text-outline focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            aria-label="Envoyer"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary active:scale-95"
          >
            <Icon name="send" filled />
          </button>
        </div>
      </form>
      <p className="mt-2 text-[10px] text-on-surface-variant">
        Salon local partagé entre les onglets ouverts sur cet appareil.
      </p>
    </section>
  );
}
