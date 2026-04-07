Commit all current changes with a smart commit message and push to GitHub.

Follow these steps:

1. **Check working tree state** — run `git status` and `git diff` to understand exactly what has changed. Read any modified files you haven't already read this session so you understand the changes.

2. **Abort if the tree is clean** — if there are no staged or unstaged changes, tell the user there is nothing to commit and stop.

3. **Check for secrets before staging:**
   - Scan changed files for patterns that look like tokens, API keys, or passwords (e.g., `BOT_TOKEN=<value>`, long hex/base64 strings assigned to variables)
   - If anything suspicious is found, show it to the user and ask for confirmation before proceeding
   - Never commit `.env` files or files containing hardcoded credentials

4. **Stage the changes** — use `git add` with specific file paths (never `git add -A` or `git add .` blindly). If there are untracked files, list them and ask the user whether to include each one.

5. **Write a smart commit message** following these rules:
   - First line: imperative mood, ≤72 chars, no period (e.g., `Add /stats command for lead analytics`)
   - If the changes span multiple concerns, use a short body listing each change as a bullet
   - Prefix with a type if appropriate: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
   - Base the message on what the code actually does — not generic phrases like "update files"

6. **Commit** using the message you composed.

7. **Push to the remote** — run `git push origin <current-branch>`. If the branch has no upstream yet, use `git push -u origin <current-branch>`.

8. **Report the result** — show the commit hash, message, and confirm the push succeeded. If the push is rejected (e.g., remote has diverged), explain why and ask the user how to proceed — never force-push without explicit instruction.
