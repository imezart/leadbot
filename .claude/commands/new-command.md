Add a new Telegram bot command to the LeadBot project.

Follow these steps:

1. **Ask the user for the command name** if not already provided (e.g., `stats`, `export`, `reset`). The command will be registered as `/<name>` in Telegram.

2. **Ask what the command should do** — a one-sentence description of its purpose and any key behavior (e.g., "show lead statistics for the last 7 days").

3. **Create the command handler file** at `src/bot/commands/<name>Command.js` using this structure:

```js
/**
 * /<name> command — <description>
 */

export async function <name>Command(ctx) {
  try {
    // TODO: implement command logic
    await ctx.reply('...');
  } catch (err) {
    console.error(`/<name> command error:`, err);
    await ctx.reply('Something went wrong. Please try again.');
  }
}
```

4. **Register the command** in the main bot setup file (find where other commands are registered with `bot.command(...)`) by adding:
   - The import for the new handler
   - `bot.command('<name>', <name>Command);`

5. **Add the command to the bot menu** if there is a `setMyCommands` or `bot.api.setMyCommands` call — append `{ command: '<name>', description: '<short description>' }` to the list.

6. **Create a test stub** if a `tests/` or `src/**/__tests__/` directory exists, at the appropriate path, with at least one placeholder test case.

7. After making all changes, show the user a summary of every file created or modified, and remind them to implement the TODO in the handler.
