// src/config.js
import "dotenv/config";

export const relays = JSON.parse(process.env.RELAYS);
export const targetPubkey = process.env.TARGET_PUBKEY;
export const botToken = process.env.BOT_TOKEN;
export const notificationChannelId = process.env.NOTIF_CHANNEL_ID;
export const botNsec = process.env.BOT_NSEC;