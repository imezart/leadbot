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
    .text("⬅️ К услугам", "services");
}

/**
 * Builds a tg:// URL inline button that opens the client's chat with
 * pre-filled message text. Returns undefined when username is unknown.
 *
 * @param {string|null|undefined} username  Telegram username (without @).
 * @param {string} templateText             Message to pre-fill.
 * @returns {InlineKeyboard|undefined}
 */
export function buildAdminReplyButton(username, templateText) {
  if (!username) return undefined;
  const url = `tg://resolve?domain=${username}&text=${encodeURIComponent(templateText)}`;
  return new InlineKeyboard().url(`💬 Написать @${username}`, url);
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
 * Handles an incoming text message when ctx.session.awaitingPhone === true.
 * Clears session state, notifies admin, saves lead, confirms to client.
 *
 * @param {import("grammy").Context} ctx
 */
export async function handlePhoneInput(ctx) {
  const phone        = ctx.message.text;
  const serviceName  = ctx.session.pendingService ?? null;
  const username     = ctx.from?.username ?? null;
  const userId       = ctx.from?.id ?? 0;
  const userRef      = username ? `@${username}` : `ID ${userId}`;

  ctx.session.awaitingPhone  = false;
  ctx.session.pendingService = null;

  const replyTemplate = serviceName
    ? `Здравствуйте! Вы интересовались услугой ${serviceName} и оставили номер для обратного звонка. Готовы записать вас на удобное время. Когда вам удобно?`
    : `Здравствуйте! Вы оставили номер телефона для обратного звонка. Готовы записать вас на удобное время. Когда вам удобно?`;

  const adminButton = buildAdminReplyButton(username, replyTemplate);

  try {
    await ctx.api.sendMessage(
      ADMIN_CHAT_ID,
      `📞 Запрос на обратный звонок:\n\nКлиент: ${userRef}` +
      (serviceName ? `\nУслуга: ${serviceName}` : "") +
      `\nТелефон: ${phone}`,
      adminButton ? { reply_markup: adminButton } : {}
    );
  } catch (err) {
    console.error("Failed to notify admin (phone):", err);
  }

  await saveLead({
    name: phone,
    username: ctx.from?.username,
    userId,
    request: `Обратный звонок${serviceName ? `: ${serviceName}` : ""}`,
  });

  await ctx.reply(
    `Спасибо! Мы свяжемся с вами по номеру *${phone}* в ближайшее время.`,
    {
      parse_mode: "Markdown",
      reply_markup: new InlineKeyboard().text("⬅️ К услугам", "services"),
    }
  );
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
    ? `Здравствуйте! Вы интересовались услугой ${serviceName}. Готовы записать вас на удобное время. Когда вам удобно?`
    : `Здравствуйте! Вы хотели записаться к нам. Готовы помочь — когда вам удобно?`;

  const adminButton = buildAdminReplyButton(username, replyTemplate);

  try {
    await ctx.api.sendMessage(
      ADMIN_CHAT_ID,
      `💬 Клиент хочет записаться через Telegram\n\nКлиент: ${userRef}${serviceInfo}`,
      adminButton ? { reply_markup: adminButton } : {}
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
