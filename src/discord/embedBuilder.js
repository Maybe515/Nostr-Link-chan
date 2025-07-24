// src/discord/embedBuilder.js
import { EmbedBuilder } from "discord.js";
import { findTargetNoteId, extractSenderPubkey } from "../utils/helpers.js";
import { findMatchingEmoji } from "../utils/emojiResolver.js";
import { fetchProfile } from "../utils/profileFetcher.js";

function getEmbedColor(kind) {
  switch (kind) {
    case 1: return 0x3498db;    // 💬 Reply / Quote
    case 6: return 0xf1c40f;    // 🔁 Repost
    case 7: return 0x2ecc71;    // 😊 Reaction
    case 9735: return 0xe74c3c; // ⚡ Zap
    default: return 0x95a5a6;   // Default
  }
}

export async function buildGenericEmbed(event, relayUrl) {
  return new EmbedBuilder()
    .setTitle(`New Event (kind:${event.kind})`)
    .setDescription(event.content || "(no content)")
    .setColor(getEmbedColor(event.kind))
    .setFooter({ text: `from ${relayUrl}` });
}

export async function buildReplyEmbed(event, relayUrl) {
  const noteId = findTargetNoteId(event);
  return new EmbedBuilder()
    .setTitle("💬 Reply/Quote")
    .setDescription(event.content || "(no content)")
    .addFields({ name: "Reply to", value: `\`${noteId}\``, inline: true })
    .setColor(getEmbedColor(1))
    .setFooter({ text: `from ${relayUrl}` });
}

export async function buildRepostEmbed(event, relayUrl) {
  return new EmbedBuilder()
    .setTitle("🔁 Repost")
    .setDescription(event.content || "(no content)")
    .setColor(getEmbedColor(6))
    .setFooter({ text: `from ${relayUrl}` });
}

export async function buildReactionEmbed(event, relayUrl, bot) {
  const emojiText = event.content || "😊";
  const noteId = findTargetNoteId(event);
  const profile = await fetchProfile(event.pubkey);

  const embed = new EmbedBuilder()
    .setTitle(`😊 Reaction: ${emojiText}`)
    .setDescription(`📎 [ノートを開く →](https://nostter.vercel.app/e/${noteId})`)
    .setColor(getEmbedColor(7))
    .setFooter({ text: `from ${relayUrl}` });

  if (profile) {
    embed
      .setAuthor({
        name: profile.display_name,
        iconURL: profile.picture || undefined,
        url: `https://nostter.vercel.app/${profile.npub}`,
      })
      .addFields(
        { name: "Sender", value: profile.display_name, inline: true },
        { name: "nip05", value: profile.nip05, inline: true },
        { name: "npub", value: `\`${profile.npub}\``, inline: false }
      );
  }

  const emojiUrl = bot ? findMatchingEmoji(bot, emojiText) : null;
  if (emojiUrl) {
    embed.setThumbnail(emojiUrl);
  } else {
    console.log(`⚠️ カスタム絵文字が見つかりません: ${emojiText}`);
    embed.addFields({ name: "絵文字", value: emojiText, inline: true });
  }

  return embed;
}

export async function buildZapEmbed(event, relayUrl) {
  const senderPubkey = extractSenderPubkey(event);
  const profile = senderPubkey ? await fetchProfile(senderPubkey) : null;
  const amountTag = event.tags.find(t => t[0] === "amount");
  const sats = amountTag ? parseInt(amountTag[1], 10) / 1000 : null;

  const embed = new EmbedBuilder()
    .setTitle("⚡ Zap Received")
    .setDescription(sats ? `💰 ${sats} sats received` : "(no amount)")
    .setColor(getEmbedColor(9735))
    .setFooter({ text: `from ${relayUrl}` });

  if (profile) {
    embed
      .setAuthor({
        name: profile.display_name,
        iconURL: profile.picture || undefined,
        url: `https://nostter.vercel.app/${profile.npub}`,
      })
      .addFields(
        { name: "nip05", value: profile.nip05, inline: true },
        { name: "npub", value: `\`${profile.npub}\``, inline: false }
      );
  }

  return embed;
}
