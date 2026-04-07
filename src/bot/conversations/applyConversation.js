import { InlineKeyboard } from "grammy";
import { ADMIN_CHAT_ID } from "../../utils/config.js";
import { saveLead } from "../../utils/leadStorage.js";
import { msg } from "../../utils/messages.js";
import { buildConfirmationKeyboard, buildAdminReplyButton } from "../handlers/bookingHandler.js";

/**
 * Sends the completed application to the admin chat.
 *
 * @param {import("grammy").Api} api
 * @param {string} name
 * @param {string} request
 * @param {number} userId
 * @param {string} username
 */
async function notifyAdmin(api, name, request, userId, username, replyMarkup) {
  const userRef = username ? `@${username}` : `ID ${userId}`;
  await api.sendMessage(
    ADMIN_CHAT_ID,
    `New lead:\n\nName: ${name}\nMessage: ${request}\nFrom: ${userRef}`,
    replyMarkup ? { reply_markup: replyMarkup } : {}
  );
}

/**
 * Waits for the next text message and returns its text.
 * Returns null if the user cancels via button or /cancel command.
 *
 * @param {import("@grammyjs/conversations").Conversation} conversation
 * @returns {Promise<string|null>}
 */
async function waitForTextOrCancel(conversation) {
  while (true) {
    const nextCtx = await conversation.wait();

    // Handle cancel button
    if (nextCtx.callbackQuery?.data === "cancel") {
      await nextCtx.answerCallbackQuery();
      await nextCtx.reply(
        msg.apply.cancelled,
        { reply_markup: new InlineKeyboard().text(msg.btn.apply, "apply") }
      );
      return null;
    }

    // Handle text message
    if (nextCtx.message?.text) {
      const text = nextCtx.message.text;
      if (text === "/cancel" || text.startsWith("/cancel@")) {
        await nextCtx.reply(
          msg.apply.cancelled,
          { reply_markup: new InlineKeyboard().text(msg.btn.apply, "apply") }
        );
        return null;
      }
      return text;
    }

    // Any other callback query (navigation buttons etc.) — let normal handlers run.
    if (nextCtx.callbackQuery) {
      await nextCtx.answerCallbackQuery();
      await conversation.skip();
    }
  }
}

/**
 * Multi-step conversation that collects a lead:
 * asks for name → asks for request → confirms and forwards to admin.
 *
 * @param {import("@grammyjs/conversations").Conversation} conversation
 * @param {import("grammy").Context} ctx
 */
export async function applyConversation(conversation, ctx) {
  const cancelKeyboard = new InlineKeyboard().text(msg.btn.cancel, "cancel");

  // A service name may be pre-selected when entering from the services menu.
  // conversation.external() runs only on the live execution and caches the
  // result for replays, keeping the conversation deterministic.
  const pendingService = await conversation.external(() => {
    const svc = ctx.session.pendingService ?? null;
    if (svc) ctx.session.pendingService = null;
    return svc;
  });

  await ctx.reply(msg.apply.askName, { reply_markup: cancelKeyboard });
  const name = await waitForTextOrCancel(conversation);
  if (name === null) return;

  let request;
  if (pendingService) {
    // Pre-fill the request with the selected service — skip the open-ended question.
    request = `Запись на: ${pendingService}`;
    await ctx.reply(
      `Отлично, ${name}! Вы записываетесь на *${pendingService}*. Подтверждаю вашу заявку...`,
      { parse_mode: "Markdown" }
    );
  } else {
    await ctx.reply(msg.apply.askRequest(name), { reply_markup: cancelKeyboard });
    request = await waitForTextOrCancel(conversation);
    if (request === null) return;
  }

  const replyTemplate = `Здравствуйте, ${name}! Мы получили вашу заявку. Готовы уточнить детали и записать вас на удобное время.`;
  const adminButton = buildAdminReplyButton(ctx.from?.username, replyTemplate);

  try {
    await notifyAdmin(
      ctx.api,
      name,
      request,
      ctx.from?.id ?? 0,
      ctx.from?.username,
      adminButton
    );
  } catch (err) {
    console.error("Failed to notify admin:", err);
    await ctx.reply(msg.apply.adminError);
    return;
  }

  await saveLead({
    name,
    username: ctx.from?.username,
    userId: ctx.from?.id ?? 0,
    request,
  });

  await ctx.reply(msg.apply.success(name), { reply_markup: buildConfirmationKeyboard() });
}
