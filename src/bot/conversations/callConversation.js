import { InlineKeyboard } from "grammy";
import { ADMIN_CHAT_ID } from "../../utils/config.js";
import { saveLead } from "../../utils/leadStorage.js";
import { msg } from "../../utils/messages.js";

/**
 * Conversation that handles the "call me back" contact method.
 * Asks for a phone number, notifies admin, and saves the lead.
 *
 * @param {import("@grammyjs/conversations").Conversation} conversation
 * @param {import("grammy").Context} ctx
 */
export async function callConversation(conversation, ctx) {
  // Read the pre-selected service once and cache for replays.
  const pendingService = await conversation.external(() => {
    const svc = ctx.session.pendingService ?? null;
    if (svc) ctx.session.pendingService = null;
    return svc;
  });

  const cancelKeyboard = new InlineKeyboard().text(msg.btn.cancel, "cancel");

  await ctx.reply(
    "📞 Введите ваш номер телефона — мы перезвоним вам в ближайшее время:",
    { reply_markup: cancelKeyboard }
  );

  let phone = null;
  while (true) {
    const nextCtx = await conversation.wait();

    if (nextCtx.callbackQuery?.data === "cancel") {
      await nextCtx.answerCallbackQuery();
      await nextCtx.reply(
        msg.apply.cancelled,
        { reply_markup: new InlineKeyboard().text(msg.btn.apply, "apply") }
      );
      return;
    }

    // Accept a Telegram contact share.
    if (nextCtx.message?.contact?.phone_number) {
      phone = nextCtx.message.contact.phone_number;
      break;
    }

    if (nextCtx.message?.text) {
      const text = nextCtx.message.text;
      if (text === "/cancel" || text.startsWith("/cancel@")) {
        await nextCtx.reply(
          msg.apply.cancelled,
          { reply_markup: new InlineKeyboard().text(msg.btn.apply, "apply") }
        );
        return;
      }
      phone = text;
      break;
    }
  }

  const userRef = ctx.from?.username ? `@${ctx.from.username}` : `ID ${ctx.from?.id ?? 0}`;
  const serviceInfo = pendingService ? `\nУслуга: ${pendingService}` : "";

  try {
    await ctx.api.sendMessage(
      ADMIN_CHAT_ID,
      `📞 Запрос на обратный звонок:\n\nТелефон: ${phone}${serviceInfo}\nОт: ${userRef}`
    );
  } catch (err) {
    console.error("Failed to notify admin (callConversation):", err);
  }

  await saveLead({
    name: phone,
    username: ctx.from?.username,
    userId: ctx.from?.id ?? 0,
    request: `Обратный звонок${pendingService ? `: ${pendingService}` : ""}`,
  });

  await ctx.reply(
    `✅ Спасибо! Мы перезвоним вам на номер *${phone}* в ближайшее время.`,
    { parse_mode: "Markdown", reply_markup: new InlineKeyboard().text(msg.btn.status, "status") }
  );
}
