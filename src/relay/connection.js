// src/relay/connection.js
import { relayInit } from "nostr-tools";
import { handleEvent } from "./eventHandler.js";
import { relays, targetPubkey } from "../config.js";

/**
 * 単一Relayに接続してイベント購読を開始
 */
export async function connectRelay(url, bot, attempt = 1) {
  const relay = relayInit(url);

  try {
    await relay.connect();
    console.log(`✅ Connected to Relay: ${url}`);

    const filters = [
      { kinds: [1, 6], authors: [targetPubkey] },     // 投稿・Repost
      { kinds: [7, 9735], "#p": [targetPubkey] },     // リアクション・Zap
    ];

    const sub = relay.sub(filters);

    sub.on("event", (event) => {
      console.log(`📥 Received event: kind=${event.kind}, id=${event.id}`);
      handleEvent(event, url, bot).catch(console.error);
    });
  } catch (err) {
    console.error(`❌ Failed to connect ${url} [Attempt ${attempt}]:`, err.message);
    if (attempt < 5) {
      const delay = 2000 * attempt;
      console.log(`🔄 Retrying in ${delay}ms...`);
      setTimeout(() => connectRelay(url, bot, attempt + 1), delay);
    }
  }
}

/**
 * 全Relayに接続して購読を開始
 */
export function startRelayConnections(bot) {
  console.log(`🚀 Starting connections to ${relays.length} relays...`);
  relays.forEach((url) => connectRelay(url, bot));
}
