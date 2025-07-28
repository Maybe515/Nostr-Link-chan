# NostrとDiscordをつなぐ、小さな橋。のすとらリンクちゃん！
のすとらリンクちゃんは、**Nostrイベントをリアルタイム検知し、Discord上に通知するBot**です。<br>
Zap・投稿・リアクションなどを購読し、WebhookまたはEmbed形式で通知を行います。<br>
<br>

## 機能概要
- **Relay購読**：指定公開鍵の関連イベント（kind 1, 6, 7, 9735）を購読
- **Zapや投稿をDiscord通知**（Embed／Webhook）
- **設定分離構成**：`.env` + `config.json` で柔軟管理
- **重複通知防止**：`event.id` 判定による1回限り通知
- **note1形式リンク生成**：イベントIDを人間向けURLに変換
- **リアルタイム購読**：過去イベントは除外（`since`フィルター）
<br>

## 開発構成
### 開発環境
- Windows 11 Pro（23H2）
- Visual Studio Code　v1.102.1（user setup）
- npm　v10.9.2
- Node.js　v22.17.1（v20+ 推奨）
- discord.js　v14.21.0（v14+ 必須）
- nostr-tools　v1.17.0
- dotenv　v16.3.1
- ws　v8.18.3
<br>

### ディレクトリ構成
```
📂 nostr-link-chan/
├── 📂 src/
│   ├── 📂 discord/          
│   │   ├── bot.js             # ボット起動
│   │   └── embedBuilder.js    # Embed通知の整形・テンプレート
│   ├── 📂 relay/
│   │   ├── connection.js      # リレー接続・イベント購読
│   │   ├── eventHandler.js    # イベントハンドル
│   │   └── nostrPoster.js     # Nostrポスト用（作成中）
│   ├── 📂 utils/
│   │   ├── emojiResolver.js   # 絵文字の検索
│   │   ├── helpers.js         # ターゲット検索時に使用する関数
│   │   └── profileFetcher.js  # プロフィール取得
│   ├── config.js              # 設定ファイル読み込み
│   └── index.js               # Botの起動処理（エントリポイント）
├── 📄 .env                    # トークンやIDの環境変数
└── 📄 README.md
```
<br>

### 必要な環境変数（.env）
```env
BOT_TOKEN=your_discord_bot_token
BOT_NSEC=nsec1xxx...
TARGET_PUBKEY=abcdef1234567890deadbeefcafebabe...
NOTIF_CHANNEL_ID=123456789012345678
RELAYS=["wss//example.com", "wss//example2.com", ...]
```
<br>

## 起動方法
**※ Node.js 20.6.0 以上　必須**
以下コマンドをルートディレクトリで実行。<br>
もしくは`Launch.bat`をルートディレクトリで実行。
```
npm install
npm start
```
<br>

# 補足仕様
- `.env` から読み取った公開鍵は hex形式（64文字）で指定してください
- イベント購読には `since` を適用し、過去のイベントは通知されません
- Relay接続は5回までリトライされ、失敗時はコンソールにログ出力されます
- 通知には note1形式のURLを含め、Nostrウェブビューアと連携
<br>

# 追加予定
- DiscordからNostrへのポスト・リプ機能