// Server-side BodyOps fetch. Same direct MCP JSON-RPC pattern as adam-agent.
// 4-min in-memory cache — Tony's metrics don't change minute-to-minute.

const BODYOPS_MCP_URL =
  process.env.BODYOPS_MCP_URL ||
  "https://bodyops-production.up.railway.app/api/mcp/LCUwhtxZubYwNLO5Lz0Wn3k0W18VF0JV";

const TTL_MS = 4 * 60 * 1000;

type Rundown = {
  asOf: string;
  today: {
    recovery: number;
    recoveryBand: string;
    hrv: number;
    sleepHours: number;
  };
  weight: { kg: number };
  trainingLoad: {
    readinessBand: "GREEN" | "AMBER" | "RED";
    acwr: number;
    acwrBand: string;
  };
  weeklyZ2: {
    done: number;
    target: number;
    pct: number;
    onTrack: boolean;
  };
  alerts: Array<{
    id: string;
    severity: string;
    headline: string;
    detail: string;
  }>;
  [k: string]: unknown;
};

let cache: { data: Rundown | null; fetchedAt: number; error: string | null } = {
  data: null,
  fetchedAt: 0,
  error: null,
};

export async function getRundown(): Promise<{
  data: Rundown | null;
  cached: boolean;
  fetchedAtIso: string | null;
  error: string | null;
}> {
  const now = Date.now();
  if (cache.data && now - cache.fetchedAt < TTL_MS) {
    return {
      data: cache.data,
      cached: true,
      fetchedAtIso: new Date(cache.fetchedAt).toISOString(),
      error: null,
    };
  }
  try {
    const resp = await fetch(BODYOPS_MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: now,
        method: "tools/call",
        params: { name: "get_rundown", arguments: {} },
      }),
      cache: "no-store",
    });
    if (!resp.ok) throw new Error(`BodyOps HTTP ${resp.status}`);
    const json = await resp.json();
    const text = json?.result?.content?.[0]?.text;
    if (!text) throw new Error("BodyOps returned no content");
    const parsed = JSON.parse(text) as Rundown;
    cache = { data: parsed, fetchedAt: now, error: null };
    return {
      data: parsed,
      cached: false,
      fetchedAtIso: new Date(now).toISOString(),
      error: null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    cache.error = msg;
    return {
      data: cache.data,
      cached: !!cache.data,
      fetchedAtIso: cache.fetchedAt ? new Date(cache.fetchedAt).toISOString() : null,
      error: msg,
    };
  }
}
