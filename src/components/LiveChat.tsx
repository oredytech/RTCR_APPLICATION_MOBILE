import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "./Icon";

type Msg = { id: string; name: string; text: string; ts: number };

const STORAGE_KEY = "rtcr.livechat.messages.v1";
const NAME_KEY = "rtcr.livechat.name.v1";
const MAX = 100;

function load(): Msg[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Msg[];
    return Array.isArray(arr) ? arr.slice(-MAX) : [];
  } catch {
    return [];
  }
}

function save(msgs: Msg[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX)));
  } catch {
    /* ignore */
  }
}

export function LiveChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const bcRef = useRef<BroadcastChannel | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages(load());
    setName(window.localStorage.getItem(NAME_KEY) ?? "");
    const bc = "BroadcastChannel" in window ? new BroadcastChannel("rtcr-livechat") : null;
    bcRef.current = bc;
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "msg") setMessages((prev) => [...prev, e.data.msg as Msg].slice(-MAX));
    };
    bc?.addEventListener("message", onMsg);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setMessages(load());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      bc?.removeEventListener("message", onMsg);
      bc?.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function send(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    const n = (name.trim() || "Anonyme").slice(0, 24);
    if (!t) return;
    const msg: Msg = { id: crypto.randomUUID(), name: n, text: t.slice(0, 500), ts: Date.now() };
    const next = [...messages, msg].slice(-MAX);
    setMessages(next);
    save(next);
    bcRef.current?.postMessage({ type: "msg", msg });
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
