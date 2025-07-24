// src/utils/nostrUtils.js
import { nip19 } from "nostr-tools";

export function toNoteBech32(eventId) {
  return nip19.noteEncode(eventId);
}

export function toNpubBech32(hexPubkey) {
  return nip19.npubEncode(hexPubkey);
}
