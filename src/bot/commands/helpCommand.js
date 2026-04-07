import { InlineKeyboard } from "grammy";
import { msg } from "../../utils/messages.js";

/**
 * Handles the /help command and "help" callback query.
 * Lists all available bot actions.
 *
 * @param {import("grammy").Context} ctx
 */
export async function helpCommand(ctx) {
  const keyboard = new InlineKeyboard()
    .text(msg.btn.apply, "apply")
    .text(msg.btn.status, "status");

  await ctx.reply(msg.help.body, { reply_markup: keyboard });
}
