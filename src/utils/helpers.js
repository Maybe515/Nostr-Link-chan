export function findTargetNoteId(event) {
  const eTag = event.tags.find(t => t[0] === "e");
  return eTag ? eTag[1] : "(unknown)";
}

export function extractSenderPubkey(event) {
  const pTag = event.tags.find(t => t[0] === "p");
  return pTag ? pTag[1] : null;
}
