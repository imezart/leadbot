/**
 * Handles the /cancel command.
 * Exits any active conversation for the current user.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function cancelCommand(ctx) {
  await ctx.conversation.exit();
  await ctx.reply(
    `Заявка отменена. Ничего страшного — вы можете начать новую в любое время с помощью /apply.`
  );
}
