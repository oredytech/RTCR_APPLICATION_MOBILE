import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const CHAT_STATE_KEY = "__rtcr_livechat_state_v1";

type Msg = { id: string; name: string; text: string; ts: number; authorId?: string; senderIp?: string };

interface ChatState {
  messages: Msg[];
}

const chatState = ((globalThis as unknown) as Record<string, unknown>)[CHAT_STATE_KEY] as ChatState | undefined;
if (!chatState) {
  ((globalThis as unknown) as Record<string, unknown>)[CHAT_STATE_KEY] = { messages: [] };
}

const getChatState = () => ((globalThis as unknown) as Record<string, unknown>)[CHAT_STATE_KEY] as ChatState;
const TTL = 24 * 60 * 60 * 1000;
const MAX_MESSAGES = 250;

function cleanupChat() {
  const cutoff = Date.now() - TTL;
  const state = getChatState();
  state.messages = state.messages.filter((msg) => msg.ts > cutoff).slice(-MAX_MESSAGES);
}

function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidates = [forwarded, headers.get("cf-connecting-ip"), headers.get("x-real-ip"), headers.get("true-client-ip"), headers.get("x-client-ip")];
  const ip = candidates.find((value): value is string => typeof value === "string" && value.length > 0);
  return ip ?? "unknown";
}

async function handleChatRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/chat") {
    return null;
  }

  cleanupChat();
  if (request.method === "GET") {
    return new Response(JSON.stringify({ messages: getChatState().messages, viewerIp: getClientIp(request) }), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store, max-age=0",
      },
    });
  }

  if (request.method === "POST") {
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
      authorId: typeof payload.authorId === "string" ? payload.authorId : undefined,
      senderIp: getClientIp(request),
    };

    const state = getChatState();
    state.messages = [...state.messages, msg].slice(-MAX_MESSAGES);
    cleanupChat();

    return new Response(JSON.stringify(msg), {
      status: 201,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  if (request.method === "PUT") {
    const payload = await request.json().catch(() => null);
    if (!payload || typeof payload.id !== "string" || typeof payload.text !== "string") {
      return new Response(JSON.stringify({ error: "Payload invalide" }), {
        status: 400,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    const state = getChatState();
    const index = state.messages.findIndex((message) => message.id === payload.id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: "Message introuvable" }), {
        status: 404,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    const senderIp = getClientIp(request);
    if (state.messages[index].senderIp !== senderIp) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 403,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    state.messages[index] = {
      ...state.messages[index],
      text: payload.text.trim().slice(0, 500),
    };
    cleanupChat();

    return new Response(JSON.stringify(state.messages[index]), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  if (request.method === "DELETE") {
    const payload = await request.json().catch(() => null);
    if (!payload || typeof payload.id !== "string") {
      return new Response(JSON.stringify({ error: "Payload invalide" }), {
        status: 400,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    const state = getChatState();
    const index = state.messages.findIndex((message) => message.id === payload.id);
    if (index === -1) {
      return new Response(JSON.stringify({ error: "Message introuvable" }), {
        status: 404,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    const senderIp = getClientIp(request);
    if (state.messages[index].senderIp !== senderIp) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 403,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }

    const [removed] = state.messages.splice(index, 1);
    cleanupChat();

    return new Response(JSON.stringify(removed), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
    status: 405,
    headers: { "content-type": "application/json; charset=utf-8", Allow: "GET, POST, PUT, DELETE" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const chatResponse = await handleChatRequest(request);
      if (chatResponse) return chatResponse;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
