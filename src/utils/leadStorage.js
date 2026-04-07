import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const DATA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../src/data");
const LEADS_FILE = resolve(DATA_DIR, "leads.json");

/**
 * Reads all leads from disk. Returns an empty array if the file doesn't exist yet.
 *
 * @returns {Promise<Array>}
 */
async function readLeads() {
  if (!existsSync(LEADS_FILE)) return [];
  const raw = await readFile(LEADS_FILE, "utf-8");
  return JSON.parse(raw);
}

/**
 * Saves a new lead entry to leads.json, creating the file if needed.
 *
 * @param {{ name: string, username: string|undefined, userId: number, request: string }} lead
 */
export async function saveLead({ name, username, userId, request }) {
  await mkdir(DATA_DIR, { recursive: true });
  const leads = await readLeads();
  leads.push({
    timestamp: new Date().toISOString(),
    name,
    username: username ?? null,
    userId,
    request,
  });
  await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

/**
 * Returns lead counts for today (last 24h), this week (last 7 days), and all time.
 *
 * @returns {Promise<{ today: number, thisWeek: number, total: number }>}
 */
export async function getLeadCounts() {
  const leads = await readLeads();
  const now = Date.now();
  const MS_PER_DAY = 86_400_000;

  let today = 0;
  let thisWeek = 0;

  for (const lead of leads) {
    const age = now - new Date(lead.timestamp).getTime();
    if (age <= MS_PER_DAY) today++;
    if (age <= 7 * MS_PER_DAY) thisWeek++;
  }

  return { today, thisWeek, total: leads.length };
}
