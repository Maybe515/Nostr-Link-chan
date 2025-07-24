import { bot } from "./discord/bot.js";
import { startRelayConnections } from "./relay/connection.js";
import { botToken } from "./config.js";

console.log("📡 起動開始：のすとらリンクちゃん");
bot.login(botToken);

bot.once("ready", () => {
  startRelayConnections(bot);
});
