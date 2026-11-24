# Status

Last updated: 2026-11-24 (end of session).

## Current project: Stock Market Agent

- Client repo: `End0ro/stock-marker-agent` (agent files only). Branch `claude/gracious-faraday-78o3qr`. PR #1 is open: https://github.com/End0ro/stock-marker-agent/pull/1. No CI, no comments yet. Not merged.
- Context, decisions and open questions: `docs/context.md` in that repo. It is up to date as of today.
- Development is driven from this repo (`dev-agent`).

## Decisions

- The agent runs inside Claude Code, reports in Russian through the official Telegram plugin, and never trades. Trading tools are blocked with deny rules.
- Broker is Freedom (Tradernet), read only. Starts on a made-up portfolio (KO, NVDA, AAPL, TSLA).
- Analysis is done by our own sub-agent team (news, numbers, price, bull, bear, risk checker) built from TradingAgents' ideas. The TradingAgents program is not used (needs its own paid key, and a Claude subscription cannot be plugged into it).
- Data: Finnhub for news, Yahoo for prices, SEC EDGAR for numbers (both in backtest and live). All cut off at an as-of date.
- Halal screening is out. The client handles it.
- The agent should run on the client's own Claude subscription.
- Ahmed decided not to re-run Nov 1 to 12 with the new severity rule (about $10). Those results use the old rule.
- Plan agreed (below): each stage has one finish test, and we do not start the next stage until it passes. The agent runs on Ahmed's own computer for stages 1 to 5. The Telegram test comes first, because it is the biggest unknown.

## Built and tested

- Data tools, the team, and the `analyze-stock` skill. 97 unit tests pass.
- NVDA backtest, Nov 1 to 12, 2026. Gate passed: `review` first fired on Nov 9, three days before the CEO resigned.
- Severity fix: severity is now a fixed list in `news-analyst.md`. The news analyst also runs one plain tools command per Bash call (the permission rule does not match loops).
- Nov 5 same-input check after the fix: the Warren story was `medium` in 4 of 4 valid runs. Verdicts: `watch` 3 times, `review` once. That `review` was a fallback: the risk-checker returned invalid JSON twice.
- Final review of the branch done. No Critical issues. Findings are in `docs/context.md` under "Before going live".

## Open, not done

- Risk-checker invalid JSON. Cause found (the long `reason` line loses its comma, same mistake on the retry). Fix proposed, not approved, not applied: put `reason` last, add a self-check line, and send the error back on retry. Details in `docs/context.md`.
- Finnhub plan limits are not confirmed (their docs pages would not load for the fetch tool).
- No deny rules for Tradernet order tools yet. Add them before connecting the broker.
- Set a real `SEC_USER_AGENT` contact before live use.

## Setup notes for headless runs

- The folder must be marked trusted in Claude Code (`hasTrustDialogAccepted`), or sub-agents cannot run Bash. I set this in the cloud container only, with Ahmed's OK.
- In the cloud container the Finnhub key is injected by the proxy. On a normal machine, set `FINNHUB_API_KEY`.
- A run costs about $0.45 to $1.06 and takes 30 to 65 seconds.

## Plan (agreed Nov 24)

Rule: one finish test per stage. If a test fails, say so and stop.

- Stage 0, close the backtest. Fix the risk-checker JSON (two edits, need Ahmed's OK, see `docs/context.md`). Merge PR #1. Finish test: replay run 6's inputs through the risk-checker 10 times, report the failure count as it is.
- Stage 1, Telegram sends on its own. Ahmed makes a bot with BotFather, we install the official Telegram plugin on his computer. Finish test: a message from the agent reaches Telegram at a set time with no message from him first, 3 times in a row. If it fails, stop and choose a fallback before building more.
- Stage 2, daily digest on the made-up portfolio (KO, NVDA, AAPL, TSLA). Russian report per stock, one digest message, in Telegram. Finish test: 5 days in a row with no wrong numbers and the report check passing every time. Use a placeholder digest time until the client answers.
- Stage 3, weekly review with 2 to 3 candidates. Finish test (proposed, none in the context file): one review where every candidate has sources and nothing says "buy now".
- Stage 4, urgent alerts. Finish test: alerts are rare enough that he reads them. Also test the 30-minute delay and messages sent on their own.
- Stage 5, Q&A in Telegram. Finish test: every answer cites sources.
- Stage 6, two-week test with the client. Needs: his watchlist, digest time, price, and whose Claude subscription runs it. The client's setup is decided here.
- Stage 7, his real Freedom account, read only, then live. Needs his Tradernet read-only keys. First step: add deny rules for order tools, before the first connection.

Only stage 0 and stage 1 are broken into small tasks so far. Break down each later stage when we reach it, with the same brainstorming, plan, tests-first flow.

## Next step

1. Start a new session. Ahmed plans to finish stage 0 there and merge. Merging needs his own ask in that session. Open PRs: `End0ro/stock-marker-agent` #1 and `End0ro/dev-agent` #5 (this file).
2. Note for that session: `status.md` on `main` is old until PR #5 is merged. Read it from branch `claude/relaxed-pasteur-b2il2h` first, or merge #5 first.
3. Then stage 1: break it into small tasks (bot setup, plugin install, scheduled send, the 3-in-a-row test).

## Open questions

- Tradernet read-only keys and tool names.
- Client's watchlist, digest time, and whether stocks only.
- Price for the client.
- Whose Claude subscription runs the agent (recommended: the client's own).
