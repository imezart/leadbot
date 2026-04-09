import { Bot, session, InlineKeyboard } from "grammy";
import { startCommand } from "./src/bot/commands/startCommand.js";
import { helpCommand } from "./src/bot/commands/helpCommand.js";
import { applyCommand } from "./src/bot/commands/applyCommand.js";
import { cancelCommand } from "./src/bot/commands/cancelCommand.js";
import { statusCommand } from "./src/bot/commands/statusCommand.js";
import { statsCommand } from "./src/bot/commands/statsCommand.js";
import { showCategories, showServices, showServiceDetail } from "./src/bot/handlers/servicesHandler.js";
import { buildBookingMessage, buildBookingKeyboard, buildTelegramConfirmMessage, buildTelegramConfirmKeyboard, handleTelegramContact, handlePhoneInput } from "./src/bot/handlers/bookingHandler.js";
import { getServiceById } from "./src/data/services.js";
import { msg } from "./src/utils/messages.js";

// BOT_TOKEN must be set in .env or the host's secret manager.
const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN environment variable is not set.");
}

const bot = new Bot(token);

bot.use(session({ initial: () => ({}) }));

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
  const keyboard = new InlineKeyboard()
    .text("🦷 Услуги и цены", "services").row()
    .text(msg.btn.apply, "apply").row()
    .text(msg.btn.status, "status").row()
    .text("📍 Контакты и адрес", "contacts");
  await ctx.editMessageText(msg.start.welcome(), { reply_markup: keyboard });
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

// Contact method: call me back — session state machine.
bot.callbackQuery("bk_call", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.awaitingPhone = true;
  await ctx.editMessageText(
    "Введите ваш номер телефона в формате +48XXXXXXXXX — мы свяжемся с вами в ближайшее время.",
    { reply_markup: new InlineKeyboard().text("⬅️ Назад", "bk_back") }
  );
});

// Back to contact method selection from phone prompt or bk_tg confirmation.
bot.callbackQuery("bk_back", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.awaitingPhone = false;
  await ctx.editMessageText(
    buildBookingMessage(ctx.session.pendingService ?? null),
    { reply_markup: buildBookingKeyboard(), parse_mode: "Markdown" }
  );
});

// Contact method: write in Telegram — show confirmation step before submitting.
bot.callbackQuery("bk_tg", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    buildTelegramConfirmMessage(ctx.session.pendingService ?? null),
    { reply_markup: buildTelegramConfirmKeyboard(), parse_mode: "Markdown" }
  );
});

// Confirmed: notify admin, save lead, show final confirmation.
bot.callbackQuery("bk_tg_confirm", async (ctx) => {
  await ctx.answerCallbackQuery();
  await handleTelegramContact(ctx);
});

bot.callbackQuery("status", async (ctx) => {
  await ctx.answerCallbackQuery();
  await statusCommand(ctx);
});

bot.callbackQuery("help", async (ctx) => {
  await ctx.answerCallbackQuery();
  await helpCommand(ctx);
});

// Handle phone number input when awaitingPhone session flag is set.
bot.on("message:text", async (ctx) => {
  if (!ctx.session.awaitingPhone) return;
  await handlePhoneInput(ctx);
});

// Global error handler — prevents unhandled errors from crashing the process.
bot.catch((err) => console.error("Bot error:", err));

// Start receiving updates via long polling.
bot.start();
