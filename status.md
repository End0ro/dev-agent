# Status

Last updated: 2026-11-24.

## Current project: Stock Market Agent

- Client repo: `End0ro/stock-marker-agent` (agent files only). Branch `claude/gracious-faraday-78o3qr`, no PR yet.
- Context, decisions and open questions: `docs/context.md` in that repo (not yet updated with the items below).
- Development is driven from this repo (`dev-agent`).

## Decisions

- The agent runs inside Claude Code, reports in Russian through the official Telegram plugin, and never trades. Trading tools are blocked with deny rules.
- Broker is Freedom (Tradernet), read only. Starts on a made-up portfolio (KO, NVDA, AAPL, TSLA).
- Analysis is done by our own sub-agent team (news, numbers, price, bull, bear, risk checker) built from TradingAgents' ideas. The TradingAgents program is not used.
- Data: Finnhub for news, Yahoo for prices, SEC EDGAR for numbers. All cut off at an as-of date, so the same code works for backtests and live runs.
- Halal screening is out. The client handles it.
- The agent should run on the client's own Claude subscription.

## Built and tested

- Data tools (`python -m tools ...`), the team, and the `analyze-stock` skill. 97 unit tests pass.
- NVDA backtest, Nov 1 to 12, 2026 (results in `backtest/results/summary.md`):
  - Gate passed. `review` first fired on Nov 9, three days before the CEO resigned. Nov 1 to 8 were `watch`.
  - Same-input check failed. Nov 5 gave `watch` the first time and `review` on a repeat. Cause: the news analyst rated the same story `medium` once and `high` once.

## Next step

1. Decide: fix the news analyst's severity rules, then re-run Nov 5 a few times (about $1.20 a run), or note it as a known problem and move on.
2. Update `docs/context.md`.
3. Final review of the branch, then open the PR.

## Open questions

- Tradernet read-only keys and tool names.
- Client's watchlist, digest time, and whether stocks only.
- Price for the client.
