import { buildBookingMessage, buildBookingKeyboard } from "../handlers/bookingHandler.js";

/**
 * Handles the /apply command.
 * Shows the contact method selection screen with no pre-selected service.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function applyCommand(ctx) {
  ctx.session.pendingService = null;
  await ctx.reply(
    buildBookingMessage(null),
    { reply_markup: buildBookingKeyboard(), parse_mode: "Markdown" }
  );
}
