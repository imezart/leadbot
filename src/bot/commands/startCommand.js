import { InlineKeyboard } from "grammy";
import { msg } from "../../utils/messages.js";

/**
 * Handles the /start command.
 * Sends a welcome message with inline keyboard buttons.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function startCommand(ctx) {
  const firstName = ctx.from?.first_name ?? msg.start.nameFallback;
  const keyboard = new InlineKeyboard()
    .text(msg.btn.apply, "apply").row()
    .text(msg.btn.status, "status").row()
    .text(msg.btn.help, "help");

  await ctx.reply(msg.start.welcome(firstName), { reply_markup: keyboard });
}
