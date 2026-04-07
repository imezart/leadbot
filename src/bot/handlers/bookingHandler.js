import { InlineKeyboard } from "grammy";

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
    .text("📋 Оставить заявку", "bk_form");
}
