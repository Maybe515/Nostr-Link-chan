import { getEventHash, signEvent, relayInit, getPublicKey, nip19,} from "nostr-tools";
import { relays, botNsec } from "../config.js";

export async function postToNostr(content, tags = []) {
  const { data: sk } = nip19.decode(botNsec);
  const pk = getPublicKey(sk);

  const event = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags,
    content,
    pubkey: pk,
  };

  event.id = getEventHash(event);
  event.sig = signEvent(event, sk);

  for (const url of relays) {
    try {
      const relay = relayInit(url);
      await relay.connect();
      const pub = relay.publish(event);

      pub.on("ok", () => console.log(`📤 Posted to ${url}`));
      pub.on("failed", (reason) => console.error(`❌ Post failed at ${url}`, reason));
    } catch (e) {
      console.warn(`⚠️ Relay error at ${url}`, e.message);
    }
  }
}
