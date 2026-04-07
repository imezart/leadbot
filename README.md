# LeadBot

A Telegram bot that collects leads for small businesses. When a potential customer reaches out, LeadBot guides them through a short inquiry form, forwards the submission to the business owner's Telegram chat, and saves it to local JSON storage. The admin can check lead statistics at any time with a single command.

The bot is production-ready and deployed on Railway.

## Commands

| Command | Who | Description |
|---|---|---|
| `/apply` | User | Opens a guided 2-step form: name then request message |
| `/status` | User | Confirms that their inquiry was received |
| `/cancel` | User | Exits the form at any step |
| `/help` | User | Lists all available commands |
| `/stats` | Admin only | Shows lead counts for today, this week, and all time |

## How It Works

1. User sends `/apply`
2. Bot asks for their name, then their request
3. Submission is forwarded to the admin's Telegram chat
4. Lead is saved to `src/data/leads.json` with timestamp, name, username, user ID, and message
5. Admin can run `/stats` to view counts at any time

## Requirements

- Node.js 24+
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- The admin's Telegram chat ID

## Setup

```bash
# Install dependencies
npm install

# Configure environment — create a .env file with the variables below
```

## Environment Variables

| Variable | Description |
|---|---|
| `BOT_TOKEN` | Telegram bot token from @BotFather |
| `ADMIN_CHAT_ID` | Chat ID that receives lead notifications and can run /stats |

Both variables are required — the bot will throw on startup if either is missing.

## Running

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

## Deployment

The bot is deployed on [Railway](https://railway.app). Railway runs `npm start` automatically. Set `BOT_TOKEN` and `ADMIN_CHAT_ID` as environment variables in the Railway project settings.

## Project Structure

```
index.js                         # Entry point — bot setup and command registration
src/
├── bot/
│   ├── commands/                # One file per command handler
│   │   ├── applyCommand.js
│   │   ├── cancelCommand.js
│   │   ├── helpCommand.js
│   │   ├── startCommand.js
│   │   ├── statsCommand.js
│   │   └── statusCommand.js
│   └── conversations/
│       └── applyConversation.js # Multi-step lead collection flow
├── data/                        # Runtime data — gitignored
│   └── leads.json               # Persisted lead submissions
└── utils/
    ├── config.js                # Environment variable validation
    └── leadStorage.js           # Read/write leads.json, compute stats
```
