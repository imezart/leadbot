import { msg } from "../../utils/messages.js";

/**
 * Handles the /cancel command.
 * Exits any active conversation for the current user.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function cancelCommand(ctx) {
  await ctx.conversation.exit();
  await ctx.reply(msg.cancel.confirmed);
}
