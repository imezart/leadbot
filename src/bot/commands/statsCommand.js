import { ADMIN_CHAT_ID } from "../../utils/config.js";

/**
 * /stats command — show lead counts for today, this week, and all time.
 * Restricted to the admin chat only.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function statsCommand(ctx) {
  try {
    if (ctx.chat.id !== ADMIN_CHAT_ID) {
      await ctx.reply("This command is only available to the admin.");
      return;
    }

    // TODO: replace with real counts from your storage layer
    const today = 0;
    const thisWeek = 0;
    const total = 0;

    await ctx.reply(
      `Lead statistics:\n\n` +
      `Today: ${today}\n` +
      `This week: ${thisWeek}\n` +
      `Total: ${total}`
    );
  } catch (err) {
    console.error("/stats command error:", err);
    await ctx.reply("Something went wrong. Please try again.");
  }
}
