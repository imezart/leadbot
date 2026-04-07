/**
 * Handles the /cancel command.
 * Exits any active conversation for the current user.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function cancelCommand(ctx) {
  await ctx.conversation.exit();
  await ctx.reply(
    `Your application has been cancelled. No worries — you can start a new one anytime with /apply.`
  );
}
