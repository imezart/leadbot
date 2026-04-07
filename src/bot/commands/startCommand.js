/**
 * Handles the /start command.
 * Sends a welcome message to the user.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function startCommand(ctx) {
  const firstName = ctx.from?.first_name ?? "there";
  await ctx.reply(
    `Hi, ${firstName}! 👋 Welcome to LeadBot.\n\n` +
    `I help small businesses collect and manage leads straight from Telegram. ` +
    `Here's what I can do for you:\n\n` +
    `/apply — submit your details to the business\n` +
    `/status — check that your inquiry was received\n` +
    `/help — see all available commands\n\n` +
    `Ready to get started? Just tap a command above.`
  );
}
