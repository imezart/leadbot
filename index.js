import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { startCommand } from "./src/bot/commands/startCommand.js";
import { helpCommand } from "./src/bot/commands/helpCommand.js";
import { applyCommand } from "./src/bot/commands/applyCommand.js";
import { cancelCommand } from "./src/bot/commands/cancelCommand.js";
import { statusCommand } from "./src/bot/commands/statusCommand.js";
import { applyConversation } from "./src/bot/conversations/applyConversation.js";

// BOT_TOKEN must be set in .env or the host's secret manager.
const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN environment variable is not set.");
}

const bot = new Bot(token);

// Session and conversations middleware (order matters).
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(applyConversation));

// Register commands.
bot.command("start", startCommand);
bot.command("help", helpCommand);
bot.command("apply", applyCommand);
bot.command("cancel", cancelCommand);
bot.command("status", statusCommand);

// Global error handler — prevents unhandled errors from crashing the process.
bot.catch((err) => console.error("Bot error:", err));

// Start receiving updates via long polling.
bot.start();
