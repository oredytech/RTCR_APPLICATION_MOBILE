import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSettings } from "@/lib/settings-context";
import { showLocalNotification } from "@/lib/notification-manager";
import { Icon } from "./Icon";

const CHAT_BELL_AUDIO = "/audio/chat-alert.mp3";

type Msg = { id: string; name: string; text: string; ts: number; authorId?: string };

const NAME_KEY = "rtcr.livechat.name.v1";
const API_URL = "/api/chat";
const POLL_INTERVAL = 4000;
const MAX = 100;

function getBubbleStyle(authorId: string | undefined, isMine: boolean) {
  if (isMine) {
    return {
      bubbleClass: "bg-primary text-on-primary",
      metaClass: "text-on-primary/90",
      nameClass: "text-on-primary",
      timeClass: "text-on-primary/70",
      alignClass: "justify-end",
    };
  }

  const seed = authorId || "anonymous";
  const hash = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const palette = [
    { bubbleClass: "bg-blue-500/15 text-blue-700", metaClass: "text-blue-700", nameClass: "text-blue-700", timeClass: "text-blue-700/70", alignClass: "justify-start" },
    { bubbleClass: "bg-emerald-500/15 text-emerald-700", metaClass: "text-emerald-700", nameClass: "text-emerald-700", timeClass: "text-emerald-700/70", alignClass: "justify-start" },
    { bubbleClass: "bg-amber-500/15 text-amber-700", metaClass: "text-amber-700", nameClass: "text-amber-700", timeClass: "text-amber-700/70", alignClass: "justify-start" },
    { bubbleClass: "bg-violet-500/15 text-violet-700", metaClass: "text-violet-700", nameClass: "text-violet-700", timeClass: "text-violet-700/70", alignClass: "justify-start" },
    { bubbleClass: "bg-pink-500/15 text-pink-700", metaClass: "text-pink-700", nameClass: "text-pink-700", timeClass: "text-pink-700/70", alignClass: "justify-start" },
    { bubbleClass: "bg-slate-600/15 text-slate-700", metaClass: "text-slate-700", nameClass: "text-slate-700", timeClass: "text-slate-700/70", alignClass: "justify-start" },
  ];

  const paletteIndex = hash % palette.length;
  return palette[paletteIndex];
}

async function fetchMessages(): Promise<Msg[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as Msg[];
}

export function LiveChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const currentAuthorId = typeof window !== "undefined" ? (window.localStorage.getItem("rtcr.livechat.author.v1") ?? "") : "";
  const { settings } = useSettings();
  const lastSeenRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setName(window.localStorage.getItem(NAME_KEY) ?? "");

    let ignore = false;
    const load = async () => {
      const serverMessages = await fetchMessages();
      if (!ignore) {
        const nextMessages = serverMessages.slice(-MAX);
        const latest = nextMessages[nextMessages.length - 1]?.ts ?? 0;
        if (nextMessages.length > 0 && latest > lastSeenRef.current && messages.length > 0) {
          const newest = nextMessages[nextMessages.length - 1];
          if (settings.notifications) {
            showLocalNotification("Nouveau message", `${newest.name} : ${newest.text}`.slice(0, 120), "/live");
          }
          if (settings.chatSoundEnabled) {
            try {
              if (!audioRef.current) {
                audioRef.current = new Audio(CHAT_BELL_AUDIO);
              }
              audioRef.current.play().catch(() => undefined);
            } catch {
              // ignore audio playback issues
            }
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
      body: JSON.stringify({ name: n, text: t.slice(0, 500), authorId: window.localStorage.getItem("rtcr.livechat.author.v1") ?? "" }),
    });

    if (!res.ok) return;
    const msg = (await res.json()) as Msg;
    setMessages((prev) => [...prev, msg].slice(-MAX));
    window.localStorage.setItem(NAME_KEY, n);
    window.localStorage.setItem("rtcr.livechat.author.v1", msg.authorId ?? "");
    setText("");
  }

  async function saveEdit() {
    const value = editValue.trim();
    if (!editingId || !value) return;
    const target = messages.find((m) => m.id === editingId);
    if (!target || (target.authorId ?? "") !== currentAuthorId) return;

    const res = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, text: value.slice(0, 500) }),
    });
    if (!res.ok) return;
    const updated = (await res.json()) as Msg;
    setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)).slice(-MAX));
    setEditingId(null);
    setEditValue("");
  }

  async function deleteMessage(id: string) {
    if (!id) return;
    const target = messages.find((m) => m.id === id);
    if (!target || (target.authorId ?? "") !== currentAuthorId) return;

    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) return;
    const removed = (await res.json()) as Msg;
    setMessages((prev) => prev.filter((m) => m.id !== removed.id).slice(-MAX));
  }

  return (
    <section className="flex h-full w-full flex-col bg-surface-container-low p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Salon en direct</h3>
        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
          <Icon name="forum" className="text-[14px]" />
          {messages.length}
        </span>
      </div>
      <div
        ref={scrollRef}
        className="mb-3 flex-1 space-y-2 overflow-y-auto rounded-lg bg-surface-container-high/50 p-2 pb-24 text-sm"
      >
        {messages.length === 0 ? (
          <p className="py-8 text-center text-xs text-on-surface-variant">
            Soyez le premier à écrire dans le salon.
          </p>
        ) : (
          messages.map((m) => {
            const isMine = (m.authorId ?? "") === currentAuthorId;
            const style = getBubbleStyle(m.authorId, isMine);
            return (
              <div key={m.id} className={`flex ${style.alignClass}`}>
                <div className={`max-w-[88%] rounded-2xl px-3 py-2 shadow-sm ${style.bubbleClass}`}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`truncate text-[11px] font-bold ${style.nameClass}`}>{m.name}</span>
                    <span className={`text-[10px] ${style.timeClass}`}>
                      {new Date(m.ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {editingId === m.id ? (
                    <div className="mt-2 space-y-2">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        maxLength={500}
                        className="w-full rounded-lg border-none bg-surface-container-high px-2 py-1 text-sm outline-none"
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={saveEdit} className="rounded-lg bg-primary px-2 py-1 text-[11px] font-semibold text-on-primary">
                          Enregistrer
                        </button>
                        <button type="button" onClick={() => { setEditingId(null); setEditValue(""); }} className="rounded-lg bg-surface-container-high px-2 py-1 text-[11px] font-semibold text-on-surface-variant">
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={`break-words text-sm ${isMine ? "text-on-primary" : "text-on-surface"}`}>{m.text}</p>
                  )}
                  {isMine && editingId !== m.id && (
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => { setEditingId(m.id); setEditValue(m.text); }} className={`text-[11px] font-semibold ${isMine ? "text-on-primary/90" : "text-primary"}`}>
                        Modifier
                      </button>
                      <button type="button" onClick={() => void deleteMessage(m.id)} className={`text-[11px] font-semibold ${isMine ? "text-on-primary/80" : "text-secondary"}`}>
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={send} className="sticky bottom-0 z-10 space-y-2 bg-surface-container-low pt-2">
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
