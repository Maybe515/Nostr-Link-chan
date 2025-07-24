export function findMatchingEmoji(bot, emojiText) {
  const name = emojiText.replace(/:/g, "").toLowerCase();

  for (const guild of bot.guilds.cache.values()) {
    const match = guild.emojis.cache.find(e => e.name.toLowerCase() === name);
    if (match) return match.url;
  }

  return null;
}
