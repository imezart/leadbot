import { Bot, session, InlineKeyboard } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { startCommand } from "./src/bot/commands/startCommand.js";
import { helpCommand } from "./src/bot/commands/helpCommand.js";
import { applyCommand } from "./src/bot/commands/applyCommand.js";
import { cancelCommand } from "./src/bot/commands/cancelCommand.js";
import { statusCommand } from "./src/bot/commands/statusCommand.js";
import { statsCommand } from "./src/bot/commands/statsCommand.js";
import { applyConversation } from "./src/bot/conversations/applyConversation.js";
import { callConversation } from "./src/bot/conversations/callConversation.js";
import { showCategories, showServices, showServiceDetail } from "./src/bot/handlers/servicesHandler.js";
import { buildBookingMessage, buildBookingKeyboard } from "./src/bot/handlers/bookingHandler.js";
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
bot.use(createConversation(callConversation));

// Register commands.
bot.command("start", startCommand);
bot.command("help", helpCommand);
bot.command("apply", applyCommand);
bot.command("cancel", cancelCommand);
bot.command("status", statusCommand);
bot.command("stats", statsCommand);

// Register inline keyboard button handlers.

// "Записаться на приём" with no pre-selected service — show contact method selection.
bot.callbackQuery("apply", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.pendingService = null;
  await ctx.editMessageText(
    buildBookingMessage(null),
    { reply_markup: buildBookingKeyboard(), parse_mode: "Markdown" }
  );
});

// Services menu — categories list.
bot.callbackQuery("services", async (ctx) => {
  await ctx.answerCallbackQuery();
  await showCategories(ctx);
});

// "Back to main menu" from services / contacts.
bot.callbackQuery("main_menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  const firstName = ctx.from?.first_name ?? msg.start.nameFallback;
  const keyboard = new InlineKeyboard()
    .text("🦷 Услуги и цены", "services").row()
    .text("📍 Контакты и адрес", "contacts").row()
    .text(msg.btn.apply, "apply").row()
    .text(msg.btn.status, "status").row()
    .text(msg.btn.help, "help");
  await ctx.editMessageText(msg.start.welcome(firstName), { reply_markup: keyboard });
});

// Contacts page.
bot.callbackQuery("contacts", async (ctx) => {
  await ctx.answerCallbackQuery();
  const text =
    `📍 *Контакты и адрес*\n\n` +
    `🏥 Клиника: DentaBot Demo\n` +
    `📌 Адрес: Plac Defilad 1, Warszawa\n` +
    `📞 Телефон: +48 123 456 789\n` +
    `💬 WhatsApp: +48 123 456 789\n` +
    `🕐 Режим работы: Пн-Вс 09:00 – 21:00`;
  const keyboard = new InlineKeyboard()
    .text("📋 Записаться на приём", "apply").row()
    .text("⬅️ Назад", "main_menu");
  await ctx.editMessageText(text, { reply_markup: keyboard, parse_mode: "Markdown" });
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

// "Записаться на приём" from a service detail — store service, show contact method selection.
bot.callbackQuery(/^svc_apply:([^:]+):([^:]+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const [, catId, svcId] = ctx.match;
  const svc = getServiceById(catId, svcId);
  ctx.session.pendingService = svc?.name ?? null;
  await ctx.editMessageText(
    buildBookingMessage(svc?.name ?? null),
    { reply_markup: buildBookingKeyboard(), parse_mode: "Markdown" }
  );
});

// Contact method: call me back.
bot.callbackQuery("bk_call", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.conversation.enter("callConversation");
});

// Contact method: write in Telegram.
bot.callbackQuery("bk_tg", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.pendingService = null;
  await ctx.editMessageText(
    `💬 *Напишите нам в Telegram*\n\n` +
    `Наш аккаунт: @dentabotdemo\n\n` +
    `Мы ответим в течение нескольких минут.`,
    {
      reply_markup: new InlineKeyboard().text("⬅️ Назад в меню", "main_menu"),
      parse_mode: "Markdown",
    }
  );
});

// Contact method: fill in the text form (existing apply conversation).
bot.callbackQuery("bk_form", async (ctx) => {
  await ctx.answerCallbackQuery();
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
