import { relayInit } from "nostr-tools";
import { handleEvent } from "./eventHandler.js";
import { getConfig } from "../configLoader.js";

const relays = getConfig("RELAYS");
const baseFilters = getConfig("FILTERS");
const since = Math.floor(Date.now() / 1000);

export async function connectRelay(url, bot, attempt = 1) {
  const relay = relayInit(url);

  try {
    await relay.connect();
    console.log(`✅ Connected to Relay: ${url}`);

    const filters = baseFilters.map((f) => ({ ...f, since }));
    const sub = relay.sub(filters);

    sub.on("event", (event) => {
      console.log(`📥 Received event: kind=${event.kind}, id=${event.id}`);
      handleEvent(event, url, bot).catch(console.error);
    });
  } catch (err) {
    console.error(`❌ Relay ${url} failed [${attempt}]`, err.message);
    if (attempt < 5) {
      setTimeout(() => connectRelay(url, bot, attempt + 1), 2000 * attempt);
    }
  }
}

export function startRelayConnections(bot) {
  console.log(`🚀 Starting connections to ${relays.length} relays...`);
  relays.forEach((url) => connectRelay(url, bot));
}
