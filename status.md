# Status

Last updated: 2026-11-24.

## Current project: Stock Market Agent

- Client repo: `End0ro/stock-marker-agent` (agent files only).
- Full context, decisions and open questions: `docs/context.md` in that repo.
- Development is driven from this repo (`dev-agent`).

## Done in the session of Nov 23 to 24, 2026

- Read the project plan PDF and turned it into a design in chat.
- Removed halal screening. The client handles it himself.
- Read the TradingAgents repo: takes holdings as input, runs on past dates, supports many AI providers, but needs its own paid AI key and makes about 10+ AI calls per stock per run.
- Designed alerts: price rules in plain code plus an AI step that labels only new headlines. Full analysis only for the digest, the weekly review, or after an urgent alert.
- Chose news every 15 minutes around the clock, prices every 5 minutes during market hours.
- Broker is Freedom (Tradernet). Found the `tradernet-sdk` package and a third-party Tradernet MCP server. Read-only keys not confirmed.
- Decided to build the agent inside Claude Code with the official Telegram plugin and the Tradernet MCP server. Trading is blocked with deny rules (checked in the official permissions docs).
- Decided to start on a made-up portfolio (KO, NVDA, AAPL, TSLA).
- Created `stock-marker-agent` with `CLAUDE.md` (the agent's instructions) and `docs/context.md`.

## Next step

1. Answer the open question: Claude does the analysis itself with TradingAgents' roles rebuilt as skills (recommended), or TradingAgents with its own paid key.
2. Design phase 1 (NVDA backtest, Nov 1 to 12) with the brainstorming skill.
3. Write the plan, then build.
