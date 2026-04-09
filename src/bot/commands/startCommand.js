import { InlineKeyboard } from "grammy";
import { msg } from "../../utils/messages.js";

/**
 * Handles the /start command.
 * Sends a welcome message with inline keyboard buttons.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function startCommand(ctx) {
  const keyboard = new InlineKeyboard()
    .text("🦷 Услуги и цены", "services").row()
    .text(msg.btn.apply, "apply").row()
    .text(msg.btn.status, "status").row()
    .text("📍 Контакты и адрес", "contacts");

  await ctx.reply(msg.start.welcome(), { reply_markup: keyboard });
}
