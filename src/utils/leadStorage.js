import { readFile, appendFile, mkdir } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const DATA_DIR  = resolve(dirname(fileURLToPath(import.meta.url)), "../../data");
const LEADS_FILE = resolve(DATA_DIR, "leads.json");

/**
 * Reads all leads from disk. Returns an empty array if the file doesn't exist
 * or if a line fails to parse (corrupt entry is skipped, not fatal).
 *
 * Leads are stored as NDJSON (one JSON object per line) so that concurrent
 * appends do not require a read-modify-write cycle and cannot overwrite each other.
 *
 * @returns {Promise<Array>}
 */
async function readLeads() {
  let raw;
  try {
    raw = await readFile(LEADS_FILE, "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }

  return raw
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];   // skip corrupt lines instead of crashing
      }
    });
}

/**
 * Appends a new lead entry to leads.json as a single NDJSON line.
 * Append is atomic for small writes, so concurrent callers cannot overwrite
 * each other's data.
 *
 * @param {{ name: string, username: string|undefined, userId: number, request: string }} lead
 */
export async function saveLead({ name, username, userId, request }) {
  await mkdir(DATA_DIR, { recursive: true });
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    name,
    username: username ?? null,
    userId,
    request,
  });
  await appendFile(LEADS_FILE, entry + "\n", "utf-8");
}

/**
 * Returns lead counts for today (last 24 h), this week (last 7 days), and all time.
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
    if (age <= MS_PER_DAY)     today++;
    if (age <= 7 * MS_PER_DAY) thisWeek++;
  }

  return { today, thisWeek, total: leads.length };
}
