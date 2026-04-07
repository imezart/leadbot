import { InlineKeyboard } from "grammy";
import { ADMIN_CHAT_ID } from "../../utils/config.js";
import { saveLead } from "../../utils/leadStorage.js";

const cancelKeyboard = new InlineKeyboard().text("❌ Отменить", "cancel");

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
        `Заявка отменена. Ничего страшного — вы можете начать новую заявку в любое время.`,
        { reply_markup: new InlineKeyboard().text("📋 Оставить заявку", "apply") }
      );
      return null;
    }

    // Handle text message
    if (nextCtx.message?.text) {
      const text = nextCtx.message.text;
      if (text === "/cancel" || text.startsWith("/cancel@")) {
        await nextCtx.reply(
          `Заявка отменена. Ничего страшного — вы можете начать новую заявку в любое время.`,
          { reply_markup: new InlineKeyboard().text("📋 Оставить заявку", "apply") }
        );
        return null;
      }
      return text;
    }

    // Ignore other update types and keep waiting
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
  await ctx.reply(
    `Давайте свяжем вас с компанией! Это займёт всего минуту.\n\n` +
    `Для начала, как вас зовут?`,
    { reply_markup: cancelKeyboard }
  );
  const name = await waitForTextOrCancel(conversation);
  if (name === null) return;

  await ctx.reply(
    `Приятно познакомиться, ${name}! Теперь опишите ваш запрос — можно подробно.`,
    { reply_markup: cancelKeyboard }
  );
  const request = await waitForTextOrCancel(conversation);
  if (request === null) return;

  try {
    await notifyAdmin(
      ctx.api,
      name,
      request,
      ctx.from?.id ?? 0,
      ctx.from?.username
    );
  } catch (err) {
    console.error("Failed to notify admin:", err);
    await ctx.reply(
      `Заявка принята, но произошла техническая ошибка. Мы всё равно постараемся с вами связаться.`
    );
    return;
  }

  await saveLead({
    name,
    username: ctx.from?.username,
    userId: ctx.from?.id ?? 0,
    request,
  });

  await ctx.reply(
    `Готово, ${name}! ✅ Ваша заявка успешно отправлена.\n\n` +
    `Компания получила уведомление и свяжется с вами в ближайшее время.`,
    { reply_markup: new InlineKeyboard().text("📊 Статус заявки", "status") }
  );
}
