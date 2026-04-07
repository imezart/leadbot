# Claude Code Guidelines

## Project Overview

LeadBot — a Telegram bot that collects leads for small businesses. Built with Node.js.

## Code Style

- **Language**: English for all code, comments, and variable names
- **Async**: Always use `async/await` — never callbacks or raw `.then()` chains
- **Functions**: Keep functions small and focused — one responsibility per function
- **Error handling**: Use `try/catch` with `async/await`, propagate errors with context

## Architecture

- Bot logic lives in `src/bot/` — handlers, commands, middleware
- Analytics logic lives in `src/analytics/`
- Scheduling/posting automation lives in `src/scheduler/`
- Shared utilities live in `src/utils/`

## Conventions

- Export one thing per file where possible
- Name handler files after the command or event they handle (e.g., `postCommand.js`)
- Keep Telegram API calls isolated in dedicated modules — don't scatter them across business logic
- Store secrets in environment variables, never hardcode them

## Dependencies

- Telegram bot library: `grammy`
- Node.js version: 24
