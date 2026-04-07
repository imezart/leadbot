import { InlineKeyboard } from "grammy";

/**
 * Handles the /help command and "help" callback query.
 * Lists all available bot actions.
 *
 * @param {import("grammy").Context} ctx
 */
export async function helpCommand(ctx) {
  const keyboard = new InlineKeyboard()
    .text("📋 Оставить заявку", "apply")
    .text("📊 Статус заявки", "status");

  await ctx.reply(
    `Вот всё, что я умею:\n\n` +
    `📋 Оставить заявку — отправить новую заявку\n` +
    `📊 Статус заявки — проверить, что заявка получена\n` +
    `❓ Помощь — показать этот список\n\n` +
    `Хотите связаться? Нажмите кнопку ниже — и компания ответит вам.`,
    { reply_markup: keyboard }
  );
}
