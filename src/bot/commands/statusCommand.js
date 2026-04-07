import { InlineKeyboard } from "grammy";
import { msg } from "../../utils/messages.js";

/**
 * Handles the /status command and "status" callback query.
 * Confirms to the user that their submitted request was received.
 *
 * @param {import("grammy").Context} ctx
 */
export async function statusCommand(ctx) {
  const keyboard = new InlineKeyboard().text(msg.btn.apply, "apply");

  await ctx.reply(msg.status.body, { reply_markup: keyboard });
}
