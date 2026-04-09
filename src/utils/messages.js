const lang = process.env.BOT_LANG === "en" ? "en" : "ru";

const strings = {
  en: {
    btn: {
      apply:  "📋 Submit Request",
      status: "📊 Check Status",
      help:   "❓ Help",
      cancel: "❌ Cancel",
    },
    start: {
      nameFallback: "there",
      welcome: (firstName) =>
        `Hello, ${firstName}! 👋 Welcome to LeadBot.\n\n` +
        `I help small businesses collect requests right in Telegram. ` +
        `Choose an action below to get started.`,
    },
    help: {
      body:
        `Here's what I can do:\n\n` +
        `📋 Submit Request — send a new request\n` +
        `📊 Check Status — confirm your request was received\n` +
        `❓ Help — show this list\n\n` +
        `Ready to reach out? Hit the button below and the company will get back to you.`,
    },
    status: {
      body:
        `Your request has been received and passed on to the company. ` +
        `They will reach out to you directly soon.\n\n` +
        `Haven't submitted a request yet? Hit the button below.`,
    },
    cancel: {
      confirmed:
        `Request cancelled. No worries — you can start a new one any time.`,
    },
    apply: {
      askName:
        `Let's connect you with the company! This will only take a minute.\n\n` +
        `First, what's your name?`,
      askRequest: (name) =>
        `Nice to meet you, ${name}! Now describe your request — feel free to go into detail.`,
      cancelled:
        `Request cancelled. No worries — you can start a new one any time.`,
      adminError:
        `Request received, but a technical error occurred. We'll still do our best to reach you.`,
      success: (name) =>
        `Done, ${name}! ✅ Your request has been sent successfully.\n\n` +
        `The company has been notified and will get in touch with you soon.`,
    },
  },

  ru: {
    btn: {
      apply:  "📋 Оставить заявку",
      status: "📊 Статус заявки",
      help:   "❓ Помощь",
      cancel: "❌ Отменить",
    },
    start: {
      nameFallback: "",
      welcome: () =>
        `🦷 Стоматология DentaBot\n\n` +
        `Современная стоматология в центре города.\n` +
        `Запись на приём — без очередей и звонков.`,
    },
    help: {
      body:
        `Вот всё, что я умею:\n\n` +
        `📋 Оставить заявку — отправить новую заявку\n` +
        `📊 Статус заявки — проверить, что заявка получена\n` +
        `❓ Помощь — показать этот список\n\n` +
        `Хотите связаться? Нажмите кнопку ниже — и компания ответит вам.`,
    },
    status: {
      body:
        `Ваша заявка получена и передана в компанию. ` +
        `С вами свяжутся напрямую в ближайшее время.\n\n` +
        `Ещё не отправляли заявку? Нажмите кнопку ниже.`,
    },
    cancel: {
      confirmed:
        `Заявка отменена. Ничего страшного — вы можете начать новую заявку в любое время.`,
    },
    apply: {
      askName:
        `Давайте свяжем вас с компанией! Это займёт всего минуту.\n\n` +
        `Для начала, как вас зовут?`,
      askRequest: (name) =>
        `Приятно познакомиться, ${name}! Теперь опишите ваш запрос — можно подробно.`,
      cancelled:
        `Заявка отменена. Ничего страшного — вы можете начать новую заявку в любое время.`,
      adminError:
        `Заявка принята, но произошла техническая ошибка. Мы всё равно постараемся с вами связаться.`,
      success: (name) =>
        `Готово, ${name}! ✅ Ваша заявка успешно отправлена.\n\n` +
        `Компания получила уведомление и свяжется с вами в ближайшее время.`,
    },
  },
};

export const msg = strings[lang];
