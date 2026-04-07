Review the entire codebase in the `src/` directory for bugs, security issues, and improvements.

Follow these steps:

1. **Read all source files** in `src/` recursively — understand what each module does before commenting on it.

2. **Check for bugs:**
   - Unhandled promise rejections or missing `try/catch` around `async/await` calls
   - Off-by-one errors, incorrect conditionals, or unreachable code
   - Incorrect use of Telegram Bot API (grammy) — wrong event names, missing awaits, improper middleware order
   - Missing null/undefined checks on user input or API responses

3. **Check for security issues:**
   - Hardcoded secrets, tokens, or API keys in source files
   - Environment variables used but not validated at startup
   - User input passed directly to shell commands, file paths, or eval
   - Sensitive data logged to console

4. **Check for code quality issues:**
   - Functions doing more than one thing (violates single responsibility)
   - Duplicated logic that should be extracted into a shared utility
   - Magic numbers or strings that should be named constants
   - Inconsistent error handling patterns across similar modules

5. **Check architecture compliance** (per CLAUDE.md):
   - Bot logic is in `src/bot/`, analytics in `src/analytics/`, scheduler in `src/scheduler/`, utilities in `src/utils/`
   - Telegram API calls are isolated — not scattered across business logic
   - One export per file where possible

6. **Output a structured report:**
   - Group findings by severity: **Critical** (bugs / security), **Warning** (quality), **Suggestion** (improvements)
   - For each finding: file path with line number, description of the issue, and a concrete fix
   - End with a short summary of overall code health

Do not make any changes — report only. Ask the user which findings to fix before touching any files.
