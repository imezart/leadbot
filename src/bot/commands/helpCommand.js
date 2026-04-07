/**
 * Handles the /help command.
 * Lists all available bot commands.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function helpCommand(ctx) {
  await ctx.reply(
    `Вот всё, что я умею:\n\n` +
    `/start — приветственное сообщение\n` +
    `/apply — отправить новую заявку\n` +
    `/status — проверить, что заявка получена\n` +
    `/cancel — отменить заявку в процессе заполнения\n` +
    `/help — показать этот список\n\n` +
    `Хотите связаться? Используйте /apply — и компания ответит вам.`
  );
}
