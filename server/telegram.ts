import type { Env } from "./http.ts";

/**
 * Sends a plain-text message to the owner's Telegram chat.
 * Never throws: the order is already saved, a failed notification must not lose it.
 */
export async function notifyTelegram(
  env: Env,
  text: string,
  fetchImpl: typeof fetch = fetch,
): Promise<{ sent: boolean; reason?: string }> {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { sent: false, reason: "Telegram təyin olunmayıb" };

  const base = env.TELEGRAM_API_BASE ?? "https://api.telegram.org";
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetchImpl(`${base}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 3900), disable_web_page_preview: true }),
      signal: ctrl.signal,
    });
    if (!res.ok) return { sent: false, reason: `Telegram cavabı: ${res.status}` };
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message : "Telegram xətası" };
  } finally {
    clearTimeout(timer);
  }
}
