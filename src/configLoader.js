// src/configLoader.js
import "dotenv/config";
import fs from "fs";
const configJson = JSON.parse(fs.readFileSync("./src/config.json", "utf-8"));


// 型チェック関数
function assertType(key, value, expectedType) {
  const actual = Array.isArray(value) ? "array" : typeof value;
  if (actual !== expectedType) {
    throw new Error(`❌ "${key}" should be ${expectedType}, but got ${actual}`);
  }
}

const config = {
  RELAYS: configJson.RELAYS,
  FILTERS: configJson.FILTERS,
  TARGET_PUBKEY: process.env.TARGET_PUBKEY,
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_NSEC: process.env.BOT_NSEC,
  NOTIF_CHANNEL_ID: process.env.NOTIF_CHANNEL_ID,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  WEBHOOK_USERNAME: process.env.WEBHOOK_USERNAME,
  WEBHOOK_AVATAR: process.env.WEBHOOK_AVATAR
};

// スキーマ定義と検証
const schema = {
  RELAYS: "array",
  FILTERS: "array",
  TARGET_PUBKEY: "string",
  BOT_TOKEN: "string",
  BOT_NSEC: "string",
  NOTIF_CHANNEL_ID: "string",
  WEBHOOK_URL: "string",
  WEBHOOK_USERNAME: "string",
  WEBHOOK_AVATAR: "string"
};

for (const [key, type] of Object.entries(schema)) {
  assertType(key, config[key], type);
}

// エクスポート
export function getConfig(key) {
  if (!(key in config)) throw new Error(`❌ Unknown config key "${key}"`);
  return config[key];
}

export default config;
