/**
 * Handles the /status command.
 * Confirms to the user that their submitted request was received.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function statusCommand(ctx) {
  await ctx.reply(
    `Ваша заявка получена и передана в компанию. ` +
    `С вами свяжутся напрямую в ближайшее время.\n\n` +
    `Ещё не отправляли заявку? Используйте /apply.`
  );
}
