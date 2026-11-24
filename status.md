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
- Decided: Claude does the analysis with its own team of sub-agents (news, numbers, price, bull and bear, risk checker) built from TradingAgents' ideas. The TradingAgents program is not used.
- Checked Anthropic's rules: a Claude subscription can't be plugged into a third-party program, and the agent should run on the client's own subscription.

## Next step

See "Next step" in `docs/context.md` of `stock-marker-agent`. In short:
1. Ahmed answers: create a free Finnhub account for dated news (recommended), or skip the backtest.
2. Design the sub-agent team from TradingAgents' role prompts. Get approval in chat.
3. Design phase 1 (NVDA backtest), plan, build.
