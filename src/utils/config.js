if (!process.env.ADMIN_CHAT_ID) {
  throw new Error("ADMIN_CHAT_ID environment variable is not set.");
}
export const ADMIN_CHAT_ID = Number(process.env.ADMIN_CHAT_ID);
