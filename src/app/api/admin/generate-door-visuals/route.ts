import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB } from "@/lib/db-vercel";

export async function POST(req: NextRequest) {
  try {
    await initDB();
    // Auth check
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 });
    }

    const { doorName, doorColor, doorSeries, doorId } = await req.json();

    if (!doorName || !doorColor || !doorSeries || !doorId) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Simulate AI-generated images (3 variants)
    // In production, you would call an actual AI API like OpenAI's DALL-E
    const prompts = [
      `Photorealistic image of a ${doorColor} steel security door model "${doorName}" (${doorSeries} series) installed in a modern home entrance. The door is professionally mounted, showing real installation with proper frame and hardware. Lighting is natural daylight, professional photography style.`,

      `A beautiful ${doorColor} steel security door "${doorName}" (${doorSeries} series) installed in an apartment entrance. Modern minimalist interior design, professional photography, natural window lighting, detailed door handle and lock visible.`,

      `Professional installation photo of ${doorColor} "${doorName}" security door (${doorSeries} series) in a residential building entrance. Shows real-world placement, quality craftsmanship, proper mounting, modern home aesthetic with warm ambient lighting.`,
    ];

    // Return placeholder response structure
    // In production, call OpenAI API or similar
    const images = prompts.map((_, idx) => ({
      id: `${doorId}-variant-${idx + 1}`,
      prompt: prompts[idx],
      status: "pending",
      url: null,
      createdAt: new Date().toISOString(),
    }));

    // TODO: Call actual AI API (OpenAI DALL-E 3 or similar)
    // For now return the structure that will be filled by actual API call

    return NextResponse.json({
      success: true,
      doorId,
      doorName,
      images,
      message: "Görsel üretimi başlatıldı. Biraz bekleyiniz...",
    });
  } catch (error) {
    console.error("Generate door visuals error:", error);
    return NextResponse.json(
      { error: "Görsel üretimi başarısız" },
      { status: 500 }
    );
  }
}

// GET endpoint to check image generation status
export async function GET(req: NextRequest) {
  try {
    await initDB();
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 401 });
    }

    const doorId = req.nextUrl.searchParams.get("doorId");

    if (!doorId) {
      return NextResponse.json(
        { error: "Door ID required" },
        { status: 400 }
      );
    }

    // TODO: Check status from AI service or database

    return NextResponse.json({
      doorId,
      status: "processing", // or "completed"
      images: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Status check failed" },
      { status: 500 }
    );
  }
}
