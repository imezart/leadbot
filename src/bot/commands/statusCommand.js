/**
 * Handles the /status command.
 * Confirms to the user that their submitted request was received.
 *
 * @param {import("grammy").CommandContext<import("grammy").Context>} ctx
 */
export async function statusCommand(ctx) {
  await ctx.reply(
    `Your inquiry has been received and forwarded to the business. ` +
    `They will reach out to you directly as soon as possible.\n\n` +
    `Haven't submitted yet? Use /apply to get started.`
  );
}
