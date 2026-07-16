import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";

// Numéros WhatsApp (masqués volontairement dans l'UI)
const TARGETS = {
  direction: { label: "Direction", number: "243994700510" },
  studio: { label: "Studio", number: "243891111489" },
} as const;

type TargetKey = keyof typeof TARGETS;

export function WhatsAppComposer() {
  const [message, setMessage] = useState("");
  const [pick, setPick] = useState<TargetKey | null>(null);
  const [confirm, setConfirm] = useState(false);

  function openPicker(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setPick(null);
    setConfirm(true);
  }

  function sendTo(key: TargetKey) {
    const url = `https://wa.me/${TARGETS[key].number}?text=${encodeURIComponent(message.trim())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setConfirm(false);
    setPick(null);
    setMessage("");
  }

  return (
    <section className="rounded-2xl p-5 glass-card">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
          <Icon name="chat" filled />
        </div>
        <div>
          <h2 className="text-lg font-bold">WhatsApp</h2>
          <p className="text-xs text-on-surface-variant">
            Écrivez votre message, puis choisissez le destinataire.
          </p>
        </div>
      </div>
      <form onSubmit={openPicker} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message…"
          required
          className="h-28 w-full rounded-xl border-none bg-surface-container p-4 text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-white transition-opacity active:opacity-90"
        >
          <Icon name="send" filled />
          Envoyer sur WhatsApp
        </button>
      </form>

      {confirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border bg-surface-container p-5 shadow-2xl"
          >
            <h3 className="mb-1 text-lg font-bold">Choisir le destinataire</h3>
            <p className="mb-4 text-sm text-on-surface-variant">
              À qui souhaitez-vous envoyer ce message ?
            </p>
            <div className="space-y-2">
              {(Object.keys(TARGETS) as TargetKey[]).map((k, i) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setPick(k)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                    pick === k
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 bg-surface-container-high text-on-surface hover:border-primary/50"
                  }`}
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                      Option {i + 1}
                    </p>
                    <p className="font-bold">{TARGETS[k].label}</p>
                  </div>
                  <Icon name={pick === k ? "radio_button_checked" : "radio_button_unchecked"} />
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-on-surface hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!pick}
                onClick={() => pick && sendTo(pick)}
                className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                Confirmer & envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
