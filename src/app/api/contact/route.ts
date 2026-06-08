import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validate-email";

type ContactBody = {
  email?: string;
  vertical?: string;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const vertical = String(body.vertical ?? "General").trim().slice(0, 80);

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const message = [
      "📩 New Abyss Studio lead",
      `Email: ${email}`,
      `Vertical: ${vertical}`,
      `Time: ${new Date().toISOString()}`,
    ].join("\n");

    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    if (!telegramRes.ok) {
      return NextResponse.json({ ok: false, error: "Dispatch failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, channel: "telegram" });
  }

  return NextResponse.json({ ok: true, channel: "local", fallback: "mailto" });
}
