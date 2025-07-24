import { buildGenericEmbed, buildReplyEmbed, buildRepostEmbed, buildReactionEmbed, buildZapEmbed,} from "../discord/embedBuilder.js";
import { getConfig } from "../configLoader.js";

const channelId = getConfig("NOTIF_CHANNEL_ID");
const notifiedEventIds = new Set();

export async function handleEvent(event, relayUrl, bot) {
  const channel = await bot.channels.fetch(channelId);
  if (!channel) return;

  if (shouldNotify(event)) {
    let embed;
    switch (event.kind) {
      case 1: embed = await buildReplyEmbed(event, relayUrl); break;
      case 6: embed = await buildRepostEmbed(event, relayUrl); break;
      case 7: embed = await buildReactionEmbed(event, relayUrl, bot); break;
      case 9735: embed = await buildZapEmbed(event, relayUrl); break;
      default: embed = await buildGenericEmbed(event, relayUrl);
    }
    channel.send({ embeds: [embed] });
  } 
}

export function shouldNotify(event) {
  if (notifiedEventIds.has(event.id)) {
    console.log(`⛔ 重複イベント検知：${event.id}`);
    return false;
  }
  notifiedEventIds.add(event.id);
  return true;
}
