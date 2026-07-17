import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

type Msg = { id: string; name: string; text: string; ts: number };

const MAX = 250;
const TTL = 24 * 60 * 60 * 1000;
const CHAT_STATE_KEY = "__rtcr_livechat_state_v1";

interface ChatState {
  messages: Msg[];
}

const state = ((globalThis as unknown) as Record<string, unknown>)[CHAT_STATE_KEY] as ChatState | undefined;
const chatState = state ?? { messages: [] };
if (!state) {
  ((globalThis as unknown) as Record<string, unknown>)[CHAT_STATE_KEY] = chatState;
}

function cleanup() {
  const cutoff = Date.now() - TTL;
  chatState.messages = chatState.messages.filter((msg) => msg.ts > cutoff).slice(-MAX);
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      GET: async () => {
        cleanup();
        return new Response(JSON.stringify(chatState.messages), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store, max-age=0",
          },
        });
      },
      POST: async ({ request }) => {
        const payload = await request.json().catch(() => null);
        if (
          !payload ||
          typeof payload.text !== "string" ||
          !payload.text.trim() ||
          typeof payload.name !== "string"
        ) {
          return new Response(JSON.stringify({ error: "Payload invalide" }), {
            status: 400,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }

        const name = payload.name.trim().slice(0, 24) || "Anonyme";
        const text = payload.text.trim().slice(0, 500);

        const msg: Msg = {
          id: crypto.randomUUID(),
          name,
          text,
          ts: Date.now(),
        };

        chatState.messages = [...chatState.messages, msg].slice(-MAX);
        cleanup();

        return new Response(JSON.stringify(msg), {
          status: 201,
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      },
    },
  },
});
