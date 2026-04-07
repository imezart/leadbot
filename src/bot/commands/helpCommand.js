/**
 * Handles the /help command.
 * Lists all available bot commands.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function helpCommand(ctx) {
  await ctx.reply(
    `Here's everything I can help you with:\n\n` +
    `/start — welcome message & quick overview\n` +
    `/apply — submit a new request to our team\n` +
    `/status — check that your request was received\n` +
    `/cancel — cancel an application in progress\n` +
    `/help — show this list\n\n` +
    `Ready to connect? Use /apply and the business will get back to you.`
  );
}
