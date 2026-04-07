import { InlineKeyboard } from "grammy";
import { ADMIN_CHAT_ID } from "../../utils/config.js";
import { saveLead } from "../../utils/leadStorage.js";

/**
 * Builds the text for the contact method selection screen.
 *
 * @param {string|null} serviceName  Pre-selected service, or null when none.
 * @returns {string}
 */
export function buildBookingMessage(serviceName) {
  const header = serviceName
    ? `Вы выбрали: *${serviceName}*\n\n`
    : "";
  return `${header}Выберите удобный способ связи:`;
}

/**
 * Builds the inline keyboard for the contact method selection screen.
 *
 * @returns {InlineKeyboard}
 */
export function buildBookingKeyboard() {
  return new InlineKeyboard()
    .text("📞 Перезвоните мне", "bk_call").row()
    .text("💬 Написать в Telegram", "bk_tg").row()
    .text("📋 Оставить заявку", "bk_form").row()
    .text("⬅️ К услугам", "services");
}

/**
 * Reusable confirmation keyboard shown after completing a booking action.
 *
 * @returns {InlineKeyboard}
 */
export function buildConfirmationKeyboard() {
  return new InlineKeyboard()
    .text("⬅️ К услугам", "services")
    .text("🏠 Главное меню", "main_menu");
}

/**
 * Handles the "💬 Написать в Telegram" contact method:
 * - reads the pending service from session
 * - notifies admin with a reply-template button
 * - saves the lead
 * - shows the client a confirmation screen
 *
 * @param {import("grammy").Context} ctx
 */
export async function handleTelegramContact(ctx) {
  const serviceName = ctx.session.pendingService ?? null;
  ctx.session.pendingService = null;

  const username = ctx.from?.username ?? null;
  const userId   = ctx.from?.id ?? 0;
  const userRef  = username ? `@${username}` : `ID ${userId}`;
  const serviceInfo = serviceName ? `\nУслуга: ${serviceName}` : "";

  const replyTemplate = serviceName
    ? `Здравствуйте! Вы интересовались услугой «${serviceName}». Хотите записаться? Уточните удобное время.`
    : `Здравствуйте! Вы хотели записаться к нам. Уточните, пожалуйста, удобное время.`;

  // Build admin notification with an optional "open chat" button.
  const adminText =
    `💬 Клиент хочет записаться через Telegram\n\n` +
    `Клиент: ${userRef}${serviceInfo}\n\n` +
    `Шаблон ответа:\n${replyTemplate}`;

  const adminKeyboard = username
    ? new InlineKeyboard().url(`💬 Написать ${userRef}`, `https://t.me/${username}`)
    : undefined;

  try {
    await ctx.api.sendMessage(
      ADMIN_CHAT_ID,
      adminText,
      adminKeyboard ? { reply_markup: adminKeyboard } : {}
    );
  } catch (err) {
    console.error("Failed to notify admin (bk_tg):", err);
  }

  await saveLead({
    name: userRef,
    username: username ?? undefined,
    userId,
    request: `Запись через Telegram${serviceName ? `: ${serviceName}` : ""}`,
  });

  await ctx.editMessageText(
    `✅ Отлично! Ваш запрос принят.\n\nМы напишем вам в Telegram в ближайшее время.`,
    { reply_markup: buildConfirmationKeyboard() }
  );
}
