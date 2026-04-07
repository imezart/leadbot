import { InlineKeyboard } from "grammy";

/**
 * Handles the /status command and "status" callback query.
 * Confirms to the user that their submitted request was received.
 *
 * @param {import("grammy").Context} ctx
 */
export async function statusCommand(ctx) {
  const keyboard = new InlineKeyboard().text("📋 Оставить заявку", "apply");

  await ctx.reply(
    `Ваша заявка получена и передана в компанию. ` +
    `С вами свяжутся напрямую в ближайшее время.\n\n` +
    `Ещё не отправляли заявку? Нажмите кнопку ниже.`,
    { reply_markup: keyboard }
  );
}
