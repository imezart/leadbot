if (!process.env.ADMIN_CHAT_ID) {
  throw new Error("ADMIN_CHAT_ID environment variable is not set.");
}
const _adminId = Number(process.env.ADMIN_CHAT_ID);
if (isNaN(_adminId)) {
  throw new Error("ADMIN_CHAT_ID must be a numeric chat ID, got: " + process.env.ADMIN_CHAT_ID);
}
export const ADMIN_CHAT_ID = _adminId;
