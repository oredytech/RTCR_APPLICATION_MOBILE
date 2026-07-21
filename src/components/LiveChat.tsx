import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSettings } from "@/lib/settings-context";
import { showLocalNotification } from "@/lib/notification-manager";
import { Icon } from "./Icon";
import { useRadio } from "@/lib/radio-context";
import { AppImage } from "./AppImage";
import { rtcrLogoSrc } from "@/lib/assets";

const CHAT_BELL_AUDIO = "/audio/chat-alert.mp3";

type Msg = { id: string; name: string; text: string; ts: number; authorId?: string; senderIp?: string };

const NAME_KEY = "rtcr.livechat.name.v1";
const API_URL = "/api/chat";
const POLL_INTERVAL = 4000;
const MAX = 100;

function getBubbleStyle(isMine: boolean) {
  if (isMine) {
    return {
      bubbleClass: "bg-[#25D366] text-white",
      metaClass: "text-white/90",
      nameClass: "text-white/90",
      timeClass: "text-white/80",
      alignClass: "justify-end",
      textClass: "text-white",
      actionClass: "text-white/90",
    };
  }

  return {
    bubbleClass: "bg-white text-[#111827]",
    metaClass: "text-[#6b7280]",
    nameClass: "text-[#6b7280]",
    timeClass: "text-[#6b7280]/70",
    alignClass: "justify-start",
    textClass: "text-[#111827]",
    actionClass: "text-[#6b7280]",
  };
}

export function LiveChat() {
  const { playing, loading, toggle } = useRadio();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [viewerIp, setViewerIp] = useState("");
  const [currentAuthorId, setCurrentAuthorId] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useSettings();
  const lastSeenRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setName(window.localStorage.getItem(NAME_KEY) ?? "");
    setCurrentAuthorId(window.localStorage.getItem("rtcr.livechat.author.v1") ?? "");

    let ignore = false;
    const load = async () => {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) return;
      const payload = (await res.json()) as { messages?: Msg[]; viewerIp?: string };
      const serverMessages = payload.messages ?? [];
      setViewerIp(payload.viewerIp ?? "");
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
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.clientHeight - el.scrollTop < 120;
    if (isNearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    const n = (name.trim() || "Anonyme").slice(0, 24);
    if (!t) return;

    const payload: Record<string, unknown> = {
      name: n,
      text: t.slice(0, 500),
    };
    if (currentAuthorId) {
      payload.authorId = currentAuthorId;
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return;
    const msg = (await res.json()) as Msg;
    setMessages((prev) => [...prev, msg].slice(-MAX));
    window.localStorage.setItem(NAME_KEY, n);
    if (msg.authorId) {
      window.localStorage.setItem("rtcr.livechat.author.v1", msg.authorId);
      setCurrentAuthorId(msg.authorId);
    }
    setText("");
  }

  async function saveEdit() {
    const value = editValue.trim();
    if (!editingId || !value) return;
    const target = messages.find((m) => m.id === editingId);
    if (!target || !target.authorId || target.authorId !== currentAuthorId) return;

    const res = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, text: value.slice(0, 500), authorId: currentAuthorId }),
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
    if (!target || !target.authorId || target.authorId !== currentAuthorId) return;

    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, authorId: currentAuthorId }),
    });
    if (!res.ok) return;
    const removed = (await res.json()) as Msg;
    setMessages((prev) => prev.filter((m) => m.id !== removed.id).slice(-MAX));
  }

  return (
    <section className="flex h-full w-full items-center justify-center bg-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-full sm:max-w-3xl h-[90vh] sm:h-[80vh] md:h-[80vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-3 sm:px-4 py-3 border-b">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <AppImage src={rtcrLogoSrc} alt="RTCR" className="w-9 h-9 object-contain" />
          </div>
          <div className="flex-1">
            <div className="text-sm sm:text-base font-semibold">Salon en direct</div>
            <div className="text-[11px] sm:text-xs text-slate-500">Conversation publique · {messages.length} messages</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} aria-label={playing ? 'Pause radio' : 'Lecture radio'} className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 active:scale-95">
              <Icon name={loading ? 'hourglass_empty' : playing ? 'pause' : 'play_arrow'} filled className="text-[20px] text-white" />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 hidden sm:inline-flex"><Icon name="search" /></button>
            <button className="p-2 rounded-lg hover:bg-slate-100 hidden sm:inline-flex"><Icon name="more_vert" /></button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-b from-white to-gray-50">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500">Aucun message pour le moment — participez à la conversation !</div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, idx) => {
                const prev = messages[idx - 1];
                const isMine = !!m.authorId && m.authorId === currentAuthorId;
                const showAvatar = !isMine && (!prev || prev.authorId !== m.authorId);
                const initials = (m.name || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

                return (
                  <div key={m.id} className={`w-full flex items-end ${isMine ? 'justify-start' : 'justify-end'}`}>
                    <div className="flex items-end gap-3 px-1 sm:px-2 w-full box-border">

                      <div className={`flex-1 ${isMine ? 'flex justify-start' : 'flex justify-end'}`}>
                        <div className={`max-w-[calc(100%-64px)] sm:max-w-[75%]`}>
                          <div className="text-[12px] sm:text-[13px] font-semibold text-slate-600 mb-1">{m.name}</div>

                          {editingId === m.id ? (
                            <div className="space-y-2">
                              <input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                maxLength={500}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
                              />
                              <div className="flex gap-2">
                                <button type="button" onClick={saveEdit} className="rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-on-primary">Enregistrer</button>
                                <button type="button" onClick={() => { setEditingId(null); setEditValue(""); }} className="rounded-lg bg-surface-container-high px-3 py-1 text-sm font-semibold">Annuler</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className={`${isMine ? 'bg-primary text-on-primary rounded-bl-none' : 'bg-slate-100 text-slate-900 rounded-br-none'} px-3 sm:px-4 py-2 rounded-2xl shadow-sm break-words`}> 
                                <div className="text-sm sm:text-base">{m.text}</div>
                              </div>

                              <div className={`mt-1 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] ${isMine ? 'text-slate-400' : 'text-slate-400'}`}>
                                <span className={`${isMine ? 'text-left' : 'text-right'}`}>{new Date(m.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                {isMine && (
                                  <div className="flex gap-2">
                                    <button type="button" onClick={() => { setEditingId(m.id); setEditValue(m.text); }} className="text-[11px] font-semibold text-on-surface-variant">Modifier</button>
                                    <button type="button" onClick={() => void deleteMessage(m.id)} className="text-[11px] font-semibold text-red-600">Supprimer</button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {!isMine && (
                        <div className="flex-shrink-0 ml-0 sm:ml-3">
                          {showAvatar ? (
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700">{initials}</div>
                          ) : (
                            <div className="w-8 h-8 sm:w-9 sm:h-9" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Composer */}
        <form onSubmit={send} className="px-3 sm:px-4 py-3 border-t bg-white">
          <div className="mb-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom (affiché aux autres)"
              maxLength={24}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrire un message..."
              maxLength={500}
              className="flex-1 rounded-full border border-slate-200 px-3 sm:px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="ml-1 rounded-full bg-primary p-2 sm:p-3 text-white shadow-md">
              <Icon name="send" filled />
            </button>
          </div>
          <div className="mt-2 text-[11px] sm:text-xs text-slate-400">Ton nom sera utilisé pour t'identifier dans la conversation.</div>
        </form>
      </div>
    </section>
  );
}
