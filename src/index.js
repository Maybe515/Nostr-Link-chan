import { Client, GatewayIntentBits, Partials } from "discord.js";
import { startRelayConnections } from "./relay/connection.js";
import { getConfig } from "./configLoader.js";

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const token = getConfig("BOT_TOKEN");

console.log("📡 起動開始：のすとらリンクちゃん");
bot.login(token);

bot.once("ready", () => {
  console.log(`🤖 Logged in as ${bot.user.tag}`);
  startRelayConnections(bot);
});
