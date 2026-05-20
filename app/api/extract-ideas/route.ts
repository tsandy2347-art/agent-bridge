import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Per-agent backend routing. Keeps the LLM_API_KEY server-side so the
// browser never sees it. Maps the agent's lowercase id to its Custom
// LLM server's URL + Bearer secret.
const AGENT_BACKENDS: Record<string, { url?: string; key?: string }> = {
  claire: {
    url: process.env.CLAIRE_AGENT_URL,
    key: process.env.CLAIRE_AGENT_KEY,
  },
  adam: {
    url: process.env.ADAM_AGENT_URL,
    key: process.env.ADAM_AGENT_KEY,
  },
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    agent?: string;
    transcript?: Array<{ role: string; text: string }>;
  } | null;

  if (!body?.agent || !Array.isArray(body.transcript)) {
    return NextResponse.json(
      { error: "agent and transcript[] required" },
      { status: 400 },
    );
  }

  const backend = AGENT_BACKENDS[body.agent.toLowerCase()];
  if (!backend?.url || !backend?.key) {
    return NextResponse.json(
      { error: `no extraction backend wired for agent '${body.agent}'` },
      { status: 501 },
    );
  }

  try {
    const upstream = await fetch(`${backend.url}/extract-ideas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backend.key}`,
      },
      body: JSON.stringify({
        transcript: body.transcript,
        agent: body.agent.toLowerCase(),
      }),
    });
    const text = await upstream.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: "non-JSON response from agent", raw: text.slice(0, 500) };
    }
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
