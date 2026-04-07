import { InlineKeyboard } from "grammy";
import { ADMIN_CHAT_ID } from "../../utils/config.js";
import { saveLead } from "../../utils/leadStorage.js";
import { msg } from "../../utils/messages.js";
import { buildAdminReplyButton } from "../handlers/bookingHandler.js";

/**
 * Conversation that handles the "📞 Перезвоните мне" contact method.
 * Asks for a phone number, notifies admin, and saves the lead.
 *
 * @param {import("@grammyjs/conversations").Conversation} conversation
 * @param {import("grammy").Context} ctx
 */
export async function callConversation(conversation, ctx) {
  // Read and clear pendingService synchronously before the first wait().
  // This runs in the same middleware cycle as conversation.enter(), so the
  // session value is always available here without conversation.external().
  const pendingService = ctx.session.pendingService ?? null;
  ctx.session.pendingService = null;

  const cancelKeyboard = new InlineKeyboard().text(msg.btn.cancel, "cancel");

  await ctx.reply(
    "Введите ваш номер телефона в формате +48XXXXXXXXX — мы свяжемся с вами в ближайшее время.",
    { reply_markup: cancelKeyboard }
  );

  let phone = null;
  while (true) {
    const nextCtx = await conversation.wait();

    if (nextCtx.callbackQuery?.data === "cancel") {
      await nextCtx.answerCallbackQuery();
      await nextCtx.reply(msg.apply.cancelled, {
        reply_markup: new InlineKeyboard().text(msg.btn.apply, "apply"),
      });
      return;
    }

    if (nextCtx.message?.contact?.phone_number) {
      phone = nextCtx.message.contact.phone_number;
      break;
    }

    if (nextCtx.message?.text) {
      const text = nextCtx.message.text;
      if (text === "/cancel" || text.startsWith("/cancel@")) {
        await nextCtx.reply(msg.apply.cancelled, {
          reply_markup: new InlineKeyboard().text(msg.btn.apply, "apply"),
        });
        return;
      }
      phone = text;
      break;
    }
  }

  const username = ctx.from?.username ?? null;
  const userRef  = username ? `@${username}` : `ID ${ctx.from?.id ?? 0}`;

  const replyTemplate = pendingService
    ? `Здравствуйте! Вы интересовались услугой ${pendingService} и оставили номер для обратного звонка. Готовы записать вас на удобное время. Когда вам удобно?`
    : `Здравствуйте! Вы оставили номер телефона для обратного звонка. Готовы записать вас на удобное время. Когда вам удобно?`;

  const adminButton = buildAdminReplyButton(username, replyTemplate);

  try {
    await ctx.api.sendMessage(
      ADMIN_CHAT_ID,
      `📞 Запрос на обратный звонок:\n\nКлиент: ${userRef}` +
      (pendingService ? `\nУслуга: ${pendingService}` : "") +
      `\nТелефон: ${phone}`,
      adminButton ? { reply_markup: adminButton } : {}
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
    `Спасибо! Мы свяжемся с вами по номеру *${phone}* в ближайшее время.`,
    {
      parse_mode: "Markdown",
      reply_markup: new InlineKeyboard().text("⬅️ К услугам", "services"),
    }
  );
}
