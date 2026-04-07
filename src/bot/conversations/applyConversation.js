import { ADMIN_CHAT_ID } from "../../utils/config.js";

/**
 * Sends the completed application to the admin chat.
 *
 * @param {import("grammy").Api} api
 * @param {string} name
 * @param {string} request
 * @param {number} userId
 * @param {string} username
 */
async function notifyAdmin(api, name, request, userId, username) {
  const userRef = username ? `@${username}` : `ID ${userId}`;
  await api.sendMessage(
    ADMIN_CHAT_ID,
    `New lead:\n\nName: ${name}\nMessage: ${request}\nFrom: ${userRef}`
  );
}

/**
 * Waits for the next text message and returns its text.
 * Returns null and sends a cancellation reply if the user types /cancel.
 *
 * @param {import("@grammyjs/conversations").Conversation} conversation
 * @returns {Promise<string|null>}
 */
async function waitForTextOrCancel(conversation) {
  const nextCtx = await conversation.waitFor("message:text");
  const text = nextCtx.message.text;
  if (text.startsWith("/cancel")) {
    await nextCtx.reply(
      `Your application has been cancelled. No worries — you can start a new one anytime with /apply.`
    );
    return null;
  }
  return text;
}

/**
 * Multi-step conversation that collects a lead:
 * asks for name → asks for request → confirms and forwards to admin.
 *
 * @param {import("@grammyjs/conversations").Conversation} conversation
 * @param {import("grammy").Context} ctx
 */
export async function applyConversation(conversation, ctx) {
  await ctx.reply(
    `Let's get you connected with the business! This will only take a moment.\n\n` +
    `First, what's your name? (Type /cancel at any time to exit.)`
  );
  const name = await waitForTextOrCancel(conversation);
  if (name === null) return;

  await ctx.reply(
    `Nice to meet you, ${name}! Now, please describe your request in as much detail as you'd like.`
  );
  const request = await waitForTextOrCancel(conversation);
  if (request === null) return;

  await notifyAdmin(
    ctx.api,
    name,
    request,
    ctx.from.id,
    ctx.from.username
  );

  await ctx.reply(
    `All done, ${name}! ✅ Your inquiry has been submitted successfully.\n\n` +
    `The business has been notified and will get back to you as soon as possible. ` +
    `Use /status anytime to confirm your submission.`
  );
}
