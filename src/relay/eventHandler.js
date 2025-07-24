import { buildGenericEmbed, buildReplyEmbed, buildRepostEmbed, buildReactionEmbed, buildZapEmbed,} from "../discord/embedBuilder.js";
import { notificationChannelId } from "../config.js";

export async function handleEvent(event, relayUrl, bot) {
  const channel = await bot.channels.fetch(notificationChannelId);
  if (!channel) return;

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
