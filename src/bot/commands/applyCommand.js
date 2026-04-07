/**
 * Handles the /apply command.
 * Enters the multi-step lead collection conversation.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function applyCommand(ctx) {
  await ctx.conversation.enter("applyConversation");
}
