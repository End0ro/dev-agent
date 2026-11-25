# Status

Last updated: 2026-11-25 (stage 1 done).

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
- Plan agreed (below): each stage has one finish test, and we do not start the next stage until it passes. The Telegram test comes first, because it is the biggest unknown.
- Timed sends (stage 1 result, Nov 25): Claude cloud scheduled tasks, not the Telegram plugin and not GitHub Actions. The Telegram plugin is kept only for chat (Q&A, stage 5), which needs a session that stays open.
- GitHub test timer removed from `main` (client repo PR #6, Nov 25). The workflow keeps only a manual trigger.
- Why not GitHub Actions: the timer never fired. 0 timer runs in 75 minutes (merged 9:15, checked until 10:30 Ahmed's time). Manual runs of the same workflow worked, so the code is fine.
- Ahmed's computer is not an always-on home (it sleeps). He has no server now. Where the always-on chat session lives is a stage 6 decision with the client.
- Ahmed lowered the stage 1 finish test from 3 messages to 2, 5 minutes apart. Recurring (daily) runs are not proven yet. Stage 2 (5 days in a row) covers that.
- Telegram token and chat ID are plain environment variables (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) on the cloud environment "Stock Market Agent". Anyone who uses that environment can read them. Reason: cloud network secrets only add headers, and Telegram wants the token in the URL. `api.telegram.org` is added to that environment's allowed hosts. Ahmed typed the values himself, never in chat.

## Built and tested

- Data tools, the team, and the `analyze-stock` skill. 97 unit tests pass.
- NVDA backtest, Nov 1 to 12, 2026. Gate passed: `review` first fired on Nov 9, three days before the CEO resigned.
- Severity fix: severity is now a fixed list in `news-analyst.md`. The news analyst also runs one plain tools command per Bash call (the permission rule does not match loops).
- Nov 5 same-input check after the fix: the Warren story was `medium` in 4 of 4 valid runs. Verdicts: `watch` 3 times, `review` once. That `review` was a fallback: the risk-checker returned invalid JSON twice.
- Risk-checker JSON fix is in `main` (PR #2). Replay of the saved Nov 5 inputs: 0 invalid JSON in 10 runs. Not proof: run 6's exact inputs were not saved, and the retry change was never exercised. 97 unit tests pass.
- Final review of the branch done. No Critical issues. Findings are in `docs/context.md` under "Before going live".
- `python -m tools send-telegram --text "..."` in the client repo (PR #4 and #5 merged). 107 unit tests pass. The token is hidden in all error text. Real check with a fake token: Telegram answered 401, exit 1, no token in the output.
- Stage 1 test, Nov 25: two one-time cloud scheduled tasks set for 11:13 and 11:18 Ahmed's time. Both fired by themselves (1 min 40 s and 17 s late), both reported `sent: True`, no permission denials, and Ahmed confirmed the messages arrived. Each task ran a plain Python snippet with only the standard library, not the repo command. Cost per run was about $0.05 to $0.07 (list price).

## Open, not done

- The scheduled tasks use a Claude session per message. Check that this is acceptable for the daily digest, and whose subscription it runs on.
- A scheduled task did not need the repo for this test. Stage 2 needs the repo (tools, agents). Check that a fresh cloud session can get it.
- The token is a plain environment variable, not a network secret. Fine for Ahmed alone, revisit for the client.

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
- Stage 1, Telegram sends on its own. DONE Nov 25. Finish test (changed by Ahmed to 2 messages): 2 cloud scheduled tasks, 5 minutes apart, both fired by themselves, both messages arrived. Built with the `send-telegram` command plus Claude cloud scheduled tasks, not the plugin.
- Stage 2, daily digest on the made-up portfolio (KO, NVDA, AAPL, TSLA). Russian report per stock, one digest message, in Telegram. Finish test: 5 days in a row with no wrong numbers and the report check passing every time. Use a placeholder digest time until the client answers.
- Stage 3, weekly review with 2 to 3 candidates. Finish test (proposed, none in the context file): one review where every candidate has sources and nothing says "buy now".
- Stage 4, urgent alerts. Finish test: alerts are rare enough that he reads them. Also test the 30-minute delay and messages sent on their own.
- Stage 5, Q&A in Telegram. Finish test: every answer cites sources.
- Stage 6, two-week test with the client. Needs: his watchlist, digest time, price, and whose Claude subscription runs it. The client's setup is decided here.
- Stage 7, his real Freedom account, read only, then live. Needs his Tradernet read-only keys. First step: add deny rules for order tools, before the first connection.

Only stage 0 and stage 1 are broken into small tasks so far. Break down each later stage when we reach it, with the same brainstorming, plan, tests-first flow.

## Next step

1. Stage 2, daily digest on the made-up portfolio (KO, NVDA, AAPL, TSLA). Brainstorm first. Ahmed's goal: the client gets the report before the US market opens. The time comes from the client, use a placeholder until then. First question to settle: can a fresh cloud scheduled task get the repo and run `analyze-stock`?

## Open questions

- Tradernet read-only keys and tool names.
- Client's watchlist, digest time, and whether stocks only.
- Price for the client.
- Whose Claude subscription runs the agent (recommended: the client's own).
