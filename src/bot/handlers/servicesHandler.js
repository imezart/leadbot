import { InlineKeyboard } from "grammy";
import { categories, getCategoryById, getServiceById } from "../../data/services.js";

const BTN_BACK_CATEGORIES = "⬅️ Назад к категориям";
const BTN_BACK_SERVICES   = "⬅️ Назад к услугам";
const BTN_APPLY           = "📋 Записаться на приём";

/**
 * Shows the list of service categories as inline buttons.
 *
 * @param {import("grammy").Context} ctx
 */
export async function showCategories(ctx) {
  const keyboard = new InlineKeyboard();
  for (const cat of categories) {
    keyboard.text(`${cat.emoji} ${cat.name}`, `cat:${cat.id}`).row();
  }
  keyboard.text("⬅️ Назад в меню", "main_menu");

  await ctx.editMessageText(
    "🦷 *Услуги и цены*\n\nВыберите категорию:",
    { reply_markup: keyboard, parse_mode: "Markdown" }
  );
}

/**
 * Shows the list of services inside a category.
 *
 * @param {import("grammy").Context} ctx
 * @param {string} catId
 */
export async function showServices(ctx, catId) {
  const cat = getCategoryById(catId);
  if (!cat) {
    await ctx.answerCallbackQuery("Категория не найдена.");
    return;
  }

  const keyboard = new InlineKeyboard();
  for (const svc of cat.services) {
    keyboard.text(`${svc.name} — ${svc.price} zł`, `svc:${catId}:${svc.id}`).row();
  }
  keyboard.text(BTN_BACK_CATEGORIES, "services");

  await ctx.editMessageText(
    `${cat.emoji} *${cat.name}*\n\nВыберите услугу:`,
    { reply_markup: keyboard, parse_mode: "Markdown" }
  );
}

/**
 * Shows detailed info about a single service.
 *
 * @param {import("grammy").Context} ctx
 * @param {string} catId
 * @param {string} svcId
 */
export async function showServiceDetail(ctx, catId, svcId) {
  const cat = getCategoryById(catId);
  const svc = getServiceById(catId, svcId);
  if (!cat || !svc) {
    await ctx.answerCallbackQuery("Услуга не найдена.");
    return;
  }

  const text =
    `${cat.emoji} *${cat.name}*\n\n` +
    `*${svc.name}*\n\n` +
    `${svc.description}\n\n` +
    `💰 Стоимость: *${svc.price} zł*\n` +
    `⏱ Длительность: *${svc.duration}*`;

  const keyboard = new InlineKeyboard()
    .text(BTN_APPLY, `svc_apply:${catId}:${svcId}`).row()
    .text(BTN_BACK_SERVICES, `cat:${catId}`)
    .text("⬅️ К услугам", "services");

  await ctx.editMessageText(text, {
    reply_markup: keyboard,
    parse_mode: "Markdown",
  });
}
