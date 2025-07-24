import { relayInit, nip19 } from "nostr-tools";
import { relays } from "../config.js";

export async function fetchProfile(pubkey) {
  for (const url of relays) {
    try {
      const relay = relayInit(url);
      await relay.connect();

      return await new Promise((resolve) => {
        const sub = relay.sub([{ kinds: [0], authors: [pubkey], limit: 1 }]);
        sub.on("event", (event) => {
          const content = JSON.parse(event.content);
          resolve({
            display_name: content.display_name || content.name || "(no name)",
            nip05: content.nip05 || "N/A",
            picture: content.picture || null,
            npub: nip19.npubEncode(pubkey),
            pubkey,
          });
          sub.close();
        });

        setTimeout(() => resolve(null), 3000);
      });
    } catch {}
  }

  return null;
}
