import { InlineKeyboard } from "grammy";

/**
 * Handles the /start command.
 * Sends a welcome message with inline keyboard buttons.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function startCommand(ctx) {
  const firstName = ctx.from?.first_name ?? "там";
  const keyboard = new InlineKeyboard()
    .text("📋 Оставить заявку", "apply").row()
    .text("📊 Статус заявки", "status").row()
    .text("❓ Помощь", "help");

  await ctx.reply(
    `Привет, ${firstName}! 👋 Добро пожаловать в LeadBot.\n\n` +
    `Я помогаю малому бизнесу собирать заявки прямо в Telegram. ` +
    `Выберите действие ниже, чтобы начать.`,
    { reply_markup: keyboard }
  );
}
