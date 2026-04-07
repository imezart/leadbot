# LeadBot

A Telegram bot that collects leads for small businesses. When a potential customer reaches out, LeadBot guides them through a short inquiry form and forwards the submission directly to the business owner's Telegram chat.

## Features

- `/apply` — guided multi-step lead form (name + message)
- `/status` — confirms to the user that their inquiry was received
- `/cancel` — exits the form at any step
- `/help` — lists all available commands
- Instantly forwards new leads to a configurable admin chat

## Requirements

- Node.js 24+
- A Telegram bot token from [@BotFather](https://t.me/BotFather)

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and fill in BOT_TOKEN and ADMIN_CHAT_ID
```

## Environment Variables

| Variable | Description |
|---|---|
| `BOT_TOKEN` | Telegram bot token from @BotFather |
| `ADMIN_CHAT_ID` | Chat ID that receives new lead notifications |

## Running

```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

## Project Structure

```
src/
├── bot/
│   ├── commands/       # One file per command handler
│   └── conversations/  # Multi-step conversation flows
├── analytics/          # Analytics logic (upcoming)
├── scheduler/          # Posting automation (upcoming)
└── utils/              # Shared utilities
```
