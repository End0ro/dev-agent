# Status

Last updated: 2026-11-24 (stage 0 done).

## Current project: Stock Market Agent

- Client repo: `End0ro/stock-marker-agent` (agent files only). PR #1 (the team, tools and NVDA backtest) and PR #2 (risk-checker JSON fix) are both merged into `main`. No CI in that repo.
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
- Risk-checker JSON fix is in `main` (PR #2). Replay of the saved Nov 5 inputs: 0 invalid JSON in 10 runs. Not proof: run 6's exact inputs were not saved, and the retry change was never exercised. 97 unit tests pass.
- Final review of the branch done. No Critical issues. Findings are in `docs/context.md` under "Before going live".

## Open, not done

- Finnhub plan limits are not confirmed (their docs pages would not load for the fetch tool).
- No deny rules for Tradernet order tools yet. Add them before connecting the broker.
- Set a real `SEC_USER_AGENT` contact before live use.

## Setup notes for headless runs

- The folder must be marked trusted in Claude Code (`hasTrustDialogAccepted`), or sub-agents cannot run Bash. I set this in the cloud container only, with Ahmed's OK.
- In the cloud container the Finnhub key is injected by the proxy. On a normal machine, set `FINNHUB_API_KEY`.
- A run costs about $0.45 to $1.06 and takes 30 to 65 seconds.

## Plan (agreed Nov 24)

Rule: one finish test per stage. If a test fails, say so and stop.

- Stage 0, close the backtest. DONE Nov 24. Fix merged (PR #2), PR #1 merged. Finish test: 0 failures in 10 replays, on the saved Nov 5 inputs (run 6's inputs were not saved).
- Stage 1, Telegram sends on its own. Ahmed makes a bot with BotFather, we install the official Telegram plugin on his computer. Finish test: a message from the agent reaches Telegram at a set time with no message from him first, 3 times in a row. If it fails, stop and choose a fallback before building more.
- Stage 2, daily digest on the made-up portfolio (KO, NVDA, AAPL, TSLA). Russian report per stock, one digest message, in Telegram. Finish test: 5 days in a row with no wrong numbers and the report check passing every time. Use a placeholder digest time until the client answers.
- Stage 3, weekly review with 2 to 3 candidates. Finish test (proposed, none in the context file): one review where every candidate has sources and nothing says "buy now".
- Stage 4, urgent alerts. Finish test: alerts are rare enough that he reads them. Also test the 30-minute delay and messages sent on their own.
- Stage 5, Q&A in Telegram. Finish test: every answer cites sources.
- Stage 6, two-week test with the client. Needs: his watchlist, digest time, price, and whose Claude subscription runs it. The client's setup is decided here.
- Stage 7, his real Freedom account, read only, then live. Needs his Tradernet read-only keys. First step: add deny rules for order tools, before the first connection.

Only stage 0 and stage 1 are broken into small tasks so far. Break down each later stage when we reach it, with the same brainstorming, plan, tests-first flow.

## Next step

1. Stage 1, Telegram sends on its own. Ahmed has not made a bot yet. First task: he makes one with BotFather (on his phone, in Telegram).
2. Then break stage 1 into small tasks (bot setup, plugin install on his computer, scheduled send, the 3-in-a-row test), with the brainstorming, plan, tests-first flow.

## Open questions

- Tradernet read-only keys and tool names.
- Client's watchlist, digest time, and whether stocks only.
- Price for the client.
- Whose Claude subscription runs the agent (recommended: the client's own).
