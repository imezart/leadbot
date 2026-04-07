/**
 * Handles the /start command.
 * Sends a welcome message to the user.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function startCommand(ctx) {
  const firstName = ctx.from?.first_name ?? "там";
  await ctx.reply(
    `Привет, ${firstName}! 👋 Добро пожаловать в LeadBot.\n\n` +
    `Я помогаю малому бизнесу собирать заявки прямо в Telegram. ` +
    `Вот что я умею:\n\n` +
    `/apply — отправить заявку\n` +
    `/status — проверить, что заявка получена\n` +
    `/help — список всех команд\n\n` +
    `Готовы начать? Просто нажмите на команду выше.`
  );
}
