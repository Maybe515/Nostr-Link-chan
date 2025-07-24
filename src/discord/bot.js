import { Client, GatewayIntentBits, Partials } from "discord.js";
//import { botToken } from "../configLoader.js";
import { postToNostr } from "../relay/nostrPoster.js";

export const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildEmojisAndStickers,
  ],
  partials: [Partials.Channel],
});

bot.once("ready", () => {
  console.log(`🤖 Logged in as ${bot.user.tag}`);
});

bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!nostrpost ")) {
    const text = message.content.replace("!nostrpost ", "");
    await postToNostr(text);
    message.reply("📮 投稿しました！");
  }

  if (message.content.startsWith("!nostrreply ")) {
    const [, targetId, ...rest] = message.content.split(" ");
    await postToNostr(rest.join(" "), [["e", targetId]]);
    message.reply(`↩️ ${targetId} へ返信しました`);
  }

  if (message.content.startsWith("!nostrquote ")) {
    const [, targetId, ...rest] = message.content.split(" ");
    await postToNostr(`🗣️ "${rest.join(" ")}"`, [["e", targetId]]);
    message.reply(`📢 ${targetId} を引用しました`);
  }
});
