import { msg } from "../../utils/messages.js";

/**
 * Handles the /cancel command.
 * Clears any pending phone input state for the current user.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function cancelCommand(ctx) {
  ctx.session.awaitingPhone  = false;
  ctx.session.pendingService = null;
  await ctx.reply(msg.cancel.confirmed);
}
