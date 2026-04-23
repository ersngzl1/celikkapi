import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB } from "@/lib/db-vercel";
import { sql } from "@vercel/postgres";

async function getSettings() {
  try {
    const result = await sql`SELECT key, value FROM settings`;
    const settings: Record<string, string> = {};
    result.rows?.forEach((row: any) => {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    });
    return settings;
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDB();
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 });
    }

    const settings = await getSettings();
    // Trim and strip any extra quotes from the API key
    let apiKey = settings.replicateApiKey;
    if (apiKey) {
      apiKey = String(apiKey).trim().replace(/^["']+|["']+$/g, "");
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Replicate API anahtarı ayarlanmamış. Yapay Zeka ayarlarından girin." },
        { status: 400 }
      );
    }

    console.log(`[generate-door-visuals] API key length: ${apiKey.length}, starts: ${apiKey.slice(0, 5)}...`);

    const { doorName, doorColor, doorSeries } = await req.json();

    if (!doorName) {
      return NextResponse.json({ error: "Kapı adı gerekli" }, { status: 400 });
    }

    const prompt = `Professional product photograph of a ${doorColor || "dark"} steel security door named "${doorName}" from the ${doorSeries || "Premium"} series. The door is shown front-facing against a clean white/light grey studio background. Modern, elegant design with visible handle and lock hardware. High-end product photography, sharp details, studio lighting, no background distractions. The door looks premium and luxurious.`;

    const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Prefer": "wait=120",
      },
      body: JSON.stringify({
        input: {
          prompt,
          width: 768,
          height: 1024,
          num_outputs: 1,
          output_format: "webp",
          output_quality: 90,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.detail || data.error || "Replicate API hatası" },
        { status: res.status }
      );
    }

    // If we got output directly
    if (data.status === "succeeded" && data.output) {
      const output = Array.isArray(data.output) ? data.output[0] : data.output;
      return NextResponse.json({ success: true, imageUrl: output });
    }

    // Need to poll
    if (data.urls?.get && (data.status === "starting" || data.status === "processing")) {
      for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const pollRes = await fetch(data.urls.get, {
          headers: { "Authorization": `Bearer ${apiKey}` },
        });
        const pollData = await pollRes.json();
        if (pollData.status === "succeeded") {
          const output = Array.isArray(pollData.output) ? pollData.output[0] : pollData.output;
          return NextResponse.json({ success: true, imageUrl: output });
        }
        if (pollData.status === "failed" || pollData.status === "canceled") {
          return NextResponse.json({ error: pollData.error || "Görsel üretimi başarısız" }, { status: 500 });
        }
      }
      return NextResponse.json({ error: "Zaman aşımı" }, { status: 504 });
    }

    if (data.output) {
      const output = Array.isArray(data.output) ? data.output[0] : data.output;
      return NextResponse.json({ success: true, imageUrl: output });
    }

    return NextResponse.json({ error: "Beklenmeyen yanıt" }, { status: 500 });
  } catch (error) {
    console.error("Generate door visuals error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Görsel üretimi başarısız" },
      { status: 500 }
    );
  }
}
