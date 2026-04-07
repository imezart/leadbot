import { Bot, session, InlineKeyboard } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { startCommand } from "./src/bot/commands/startCommand.js";
import { helpCommand } from "./src/bot/commands/helpCommand.js";
import { applyCommand } from "./src/bot/commands/applyCommand.js";
import { cancelCommand } from "./src/bot/commands/cancelCommand.js";
import { statusCommand } from "./src/bot/commands/statusCommand.js";
import { statsCommand } from "./src/bot/commands/statsCommand.js";
import { applyConversation } from "./src/bot/conversations/applyConversation.js";
import { showCategories, showServices, showServiceDetail } from "./src/bot/handlers/servicesHandler.js";
import { getServiceById } from "./src/data/services.js";
import { msg } from "./src/utils/messages.js";

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
bot.command("stats", statsCommand);

// Register inline keyboard button handlers.
bot.callbackQuery("apply", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter("applyConversation");
});

// Services menu — categories list.
bot.callbackQuery("services", async (ctx) => {
  await ctx.answerCallbackQuery();
  await showCategories(ctx);
});

// "Back to main menu" from services.
bot.callbackQuery("main_menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  const firstName = ctx.from?.first_name ?? msg.start.nameFallback;
  const keyboard = new InlineKeyboard()
    .text("🦷 Услуги и цены", "services").row()
    .text(msg.btn.apply, "apply").row()
    .text(msg.btn.status, "status").row()
    .text(msg.btn.help, "help");
  await ctx.editMessageText(msg.start.welcome(firstName), { reply_markup: keyboard });
});

// Services menu — service list for a category.
bot.callbackQuery(/^cat:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const catId = ctx.match[1];
  await showServices(ctx, catId);
});

// Services menu — service detail.
bot.callbackQuery(/^svc:([^:]+):([^:]+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const [, catId, svcId] = ctx.match;
  await showServiceDetail(ctx, catId, svcId);
});

// "Записаться на приём" from a service detail — pre-fill service name.
bot.callbackQuery(/^svc_apply:([^:]+):([^:]+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const [, catId, svcId] = ctx.match;
  const svc = getServiceById(catId, svcId);
  if (svc) {
    ctx.session.pendingService = svc.name;
  }
  await ctx.conversation.enter("applyConversation");
});

bot.callbackQuery("status", async (ctx) => {
  await ctx.answerCallbackQuery();
  await statusCommand(ctx);
});

bot.callbackQuery("help", async (ctx) => {
  await ctx.answerCallbackQuery();
  await helpCommand(ctx);
});

// Global error handler — prevents unhandled errors from crashing the process.
bot.catch((err) => console.error("Bot error:", err));

// Start receiving updates via long polling.
bot.start();
