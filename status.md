# Status

Last updated: 2026-11-25, evening (stage 2 built; save-result, the holiday message and the daily records merged into the client repo `main`; the memory test passed; the 5-day test has not started; layout waits on the client; next session designs Q&A in Telegram; the Nov 26 and 27 runs check themselves).

## Current project: Stock Market Agent

- Client repo: `End0ro/stock-marker-agent` (agent files only). Merged into `main`: PR #1 and #2 (the team, tools, backtest, risk-checker fix), #4 to #9 (Telegram send, stage 2 digest and skill), #11 `save-result` and #12 the holiday message (#12 included #11), #15 the daily records. No CI in that repo. 228 tests pass.
- Context, decisions and open questions: `docs/context.md` in that repo (updated Nov 25 in a docs PR). This file is the short handoff.
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
- Placeholder daily digest time: the daily task is set for 06:50 Ahmed's time (UTC+3, Monday to Friday), until the client gives the real time. Ahmed's goal: the client gets the report before the US market opens. Ahmed will ask the client for the time and the layout.
- Ahmed's computer is not an always-on home (it sleeps). He has no server now. Where the always-on chat session lives is a stage 6 decision with the client.
- Ahmed lowered the stage 1 finish test from 3 messages to 2, 5 minutes apart. Recurring (daily) runs are not proven yet. Stage 2 (5 days in a row) covers that.
- Telegram token and chat ID are plain environment variables (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) on the cloud environment "Stock Market Agent". Anyone who uses that environment can read them. Reason: cloud network secrets only add headers, and Telegram wants the token in the URL. `api.telegram.org` is added to that environment's allowed hosts. Ahmed typed the values himself, never in chat.
- Ahmed decided Nov 25: everything the client reads is in Russian, headlines included. Where the Russian text comes from is still open.
- Ahmed decided Nov 25: while we build, Ahmed pays for the runs. Whose subscription pays after that is a stage 6 question.
- Ahmed decided Nov 25: Q&A in Telegram (stage 5, official plugin) is designed next, before stages 3 and 4, because the client wants to ask questions. The 5-day test of stage 2 runs by itself in the background, so building does not wait for it.
- Ahmed decided Nov 25: when the US market is closed, the agent still tracks the news and sends a message that the market is closed, with the reason. Built and merged the same day (see below). Weekends stay silent.

## Built and tested

- Data tools, the team, and the `analyze-stock` skill. 97 unit tests pass.
- NVDA backtest, Nov 1 to 12, 2026. Gate passed: `review` first fired on Nov 9, three days before the CEO resigned.
- Severity fix: severity is now a fixed list in `news-analyst.md`. The news analyst also runs one plain tools command per Bash call (the permission rule does not match loops).
- Nov 5 same-input check after the fix: the Warren story was `medium` in 4 of 4 valid runs. Verdicts: `watch` 3 times, `review` once. That `review` was a fallback: the risk-checker returned invalid JSON twice.
- Risk-checker JSON fix is in `main` (PR #2). Replay of the saved Nov 5 inputs: 0 invalid JSON in 10 runs. Not proof: run 6's exact inputs were not saved, and the retry change was never exercised. 97 unit tests pass.
- Final review of the branch done. No Critical issues. Findings are in `docs/context.md` under "Before going live".
- `python -m tools send-telegram --text "..."` in the client repo (PR #4 and #5 merged). 107 unit tests pass. The token is hidden in all error text. Real check with a fake token: Telegram answered 401, exit 1, no token in the output.
- Stage 1 test, Nov 25: two one-time cloud scheduled tasks set for 11:13 and 11:18 Ahmed's time. Both fired by themselves (1 min 40 s and 17 s late), both reported `sent: True`, no permission denials, and Ahmed confirmed the messages arrived. Each task ran a plain Python snippet with only the standard library, not the repo command. Cost per run was about $0.05 to $0.07 (list price).

- Stage 2 code, Nov 25 (client repo, merged into `main`: PR #8 the code, PR #9 the `daily-digest` skill). Built with subagents, each task reviewed, plus a final review and fixes. 141 tests pass (107 before).
  - `python -m tools send-telegram --file PATH` (new option).
  - `python -m tools build-digest TICKERS --as-of DATE --out PATH`: short Russian digest from the `analyze-stock` result files. Per stock: verdict, price with day move, top 2 news with links. Checked by the same report checker plus a 4096 length check. Writes the file only if the check passes.
  - Skill `daily-digest`: stops on Saturday and Sunday, runs `analyze-stock` for KO, NVDA, AAPL, TSLA, builds the digest, sends it. If the build fails it sends a short notice.
- Repo in a cloud task: a task made with the task tool gets no repo, and `git clone` inside a task fails (private repo, no GitHub login). A task made in claude.ai/code/routines with the repo attached does get it. Ahmed made it: name `Daily digest`, `CRON_TZ=Europe/Moscow 50 6 * * 1-5`, repo `End0ro/stock-marker-agent`, environment "Stock Market Agent", connectors removed.
- First real run, Nov 25, 09:44 UTC ("Run now"): about 12 minutes, about $3.58 at list price. The digest arrived in Telegram. Verdicts: KO watch, NVDA review, AAPL watch, TSLA watch. All four report checks passed. NVDA numbers match the run's own report. Not yet checked against the sources by hand. The task list shows "succeeded" as soon as the run starts, so it does not mean the run is done.
- Closed-day message, Nov 25 (client repo PR #12, merged): holiday list in code (2026 and 2027), `market-status` and `build-closed-digest` commands, `news-analyst` got `DAYS` (default 7) and `headline_ru`, `daily-digest` skill branches on a holiday. On a holiday only the news is read (2 days), the message is built by code, and a short notice goes out if anything fails. Built with subagents, each task reviewed, plus a final review and fixes. 191 tests pass. Holiday dates match NYSE announcements as seen in search results; the nyse.com page could not be opened. Not tried in a cloud run: first real use is Nov 26 (Thanksgiving). Fallback notice has no closing disclaimer (a status line). Holiday list needs a refresh before 2028.
- Memory test, Nov 25 (passed): a one-time routine pushed `records-test/test.txt` to `claude/records-test`, and a second routine read it back (`read: Wed Nov 25 12:57:12 UTC 2026`). Run B cost $0.08, run A cost not measured. The read run also left a branch `claude/epic-tesla-swg03d` (the run's own session branch, my guess). Both test branches are still on GitHub: my delete was denied, Ahmed deletes them. The two test routines were set daily by mistake, and Ahmed deleted them.
- Daily records, Nov 25 (client repo PR #15, merged into `main`): after each normal-day digest the run saves a small summary to the `claude/records` branch, one file per day `records/YYYY-MM-DD.json` (verdict, reason clipped to 300 characters, price, day move, news URLs), and compares with the last saved day. Commands: `records-pull`, `records-compare`, `records-save`, `records-push`. Git is only used by `tools/records_git.py` (temporary worktree, pushes only to `claude/records`, 60 second limit per call, never raises). The `daily-digest` skill runs these after the send, on normal days only. The digest text is unchanged, the compare result is only printed in the run's last line. Built with subagents, each task reviewed, plus a final review (no Critical or Important left; one fix round on the git module). 228 tests pass. Checked end to end against a local test repo, not in the cloud. Ahmed changed the `Daily digest` routine prompt to allow pushing to `claude/records` only (read back from the routine, Nov 25). Minor leftovers are in the PR review notes: `latest_before` has no fallback to an older file, tickers are not checked in `records-*`, a few missing tests, and the code reads git's English "couldn't find remote ref" text to tell a missing branch from an error.
- Problems from that run:
  - `requests` was not installed in the cloud container. The run installed it itself, and that is lost after each run. Fix added Nov 25 (not proven yet): setup script on the "Stock Market Agent" environment. It runs `pip install -r` on every `requirements.txt` it finds at the top of the checkout or one folder down, and does nothing if there is none. Proof comes from the next fresh run: check that it did not install `requests` by itself.
  - The run rebuilt the result JSON files by hand and shortened some fields (the bear's `answers_to_bull` is a placeholder in NVDA, AAPL, TSLA). Cause found Nov 25 (read from the TSLA part of the run, the last 33 events only): `analyze-stock` step 8 says "write the result JSON", but no command does it. The main agent typed the whole file by hand in a Python heredoc, at the end of a long four-stock run. It shortened the bull and bear claims, wrote `answers_to_bull` as the text "(...abridged here)" instead of a list, and typed `report_check` itself (copied from the skill's example). `check-report` did run. No code checks the shape of the result file, so nothing stopped it. Not yet checked for NVDA, AAPL, KO. Fix built and merged Nov 25 (client repo PR #11, in `main` with #12): `python -m tools save-result` builds the file from the six role outputs, runs the report check itself and rejects bad shapes (exit 1, no file). Step 8 of the skill calls it. 160 tests pass. All 13 old NVDA result files rebuild identically. Not tried in a cloud run yet (first run with it: Nov 27, since Nov 26 is a holiday). Limit: text shortened inside a valid shape is not caught.
  - The run sent itself a phone notification nobody asked for. The Stop hook asked it to commit and push and it correctly declined.
- Ahmed's feedback on the digest: too much in it, poorly structured, hard for the client to read. Main faults: the stock that needs attention is not first, no reason shown, English headlines in a Russian message, `[n]` tags on every line, repeated "серьёзно", verdict in two languages. Proposed layout (not built): attention first with a short reason, then one line per calm stock. Waiting for the client's answer.

## Open, not done

- Stage 2 is not finished. The 5-day finish test has not started. Nov 26 is US Thanksgiving and sends the closed-day message, which has no price numbers. Proposed: do not count it, so days 1 to 5 are Nov 27, 30 and Dec 1, 2, 3. Ahmed decides.
- Client questions (Ahmed asks): digest time, layout, headlines in Russian or not.
- Rebuild the digest layout after the client answers. Add the price alert level (NVDA was 27,86% below its 20-day high on Nov 25).
- Check the digest numbers against their sources by hand. TSLA done Nov 25: the tools output (price, numbers, P/E) matches the hand-typed result file on every number. That is tools against file, not against the Yahoo page or the SEC filing, and the news side is not checked. NVDA, AAPL, KO not checked.
- Where Russian text for the reason line and headlines comes from (model translation checked by the report check, or lines from the Russian report).
- No "changed from yesterday" in the digest: cloud sessions start empty.
- Records idea (Ahmed, Nov 25): keep each day's result files so the next run can read yesterday. It would give: verdict changes with a reason, "new today" vs repeated news, and later a check of verdicts against what the price did next. How: the run saves its files to a branch of the client repo and the next run reads them. First step, a cheap test that a cloud run can push: passed Nov 25. The first version is built (see "Daily records" above) and does not change the digest text, so it does not touch the 5-day count. Still open: use the compare result in the digest (verdict change, "new today") once the client answers on layout. Changing the digest text during the 5-day test may restart the count: Ahmed decides.
- Scheduled task limits (official docs, code.claude.com/docs/en/web-scheduled-tasks, read Nov 25): a schedule that runs more often than once per hour is rejected, so decision 6 (news every 15 minutes) cannot use the timer. Up to 100 scheduled runs per hour per account, and every run draws on the subscription like a normal session. A task can also be started by an HTTP POST to its own `/fire` endpoint with a bearer token (beta), and by GitHub events. A run pushes to a branch prefixed `claude/` by default unless the prompt says otherwise (our `Daily digest` prompt says do not push). The page says nothing about a maximum run time or overlapping runs. Idea for stage 4, not designed: free code outside Claude watches prices and headlines every few minutes and fires the Claude task only when something changed. That needs a timer that works (the GitHub Actions timer never fired in our test) and memory of what was already seen (the records idea).
- Instagram idea (Ahmed, Nov 25): one Claude prompt plus Airtable gives a Magnificent 7 table with a 0 to 10 score and buy/hold/sell. Not for us as is: it breaks our rules (no buy/sell calls, no number without a source) and has no checks, no timer, no Telegram. Two parts worth keeping: a table of all stocks and history (a possible home for the records idea; Airtable from a cloud run is untested and its AI billing is unknown), and market sentiment as a labelled extra with a source, later.
- Cost: about $3.58 a run is about $75 over 21 weekdays at list price (my estimate). Ahmed pays while building. Whose subscription pays after that is still open.
- The token is a plain environment variable, not a network secret. Fine for Ahmed alone, revisit for the client.
- Finnhub plan limits are not confirmed (their docs pages would not load for the fetch tool).
- Small leftovers from the reviews (details in `docs/context.md`, "Not done in stage 2"): no notification rule in the `daily-digest` skill; an unwritable `--out` gives a traceback in `build-digest` and `build-closed-digest`; some `save-result` checks are loose (null date, value types).
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
- Stage 5, Q&A in Telegram. NEXT (moved ahead of stages 3 and 4 by Ahmed, Nov 25). Finish test: every answer cites sources.
- Stage 6, two-week test with the client. Needs: his watchlist, digest time, price, and whose Claude subscription runs it. The client's setup is decided here.
- Stage 7, his real Freedom account, read only, then live. Needs his Tradernet read-only keys. First step: add deny rules for order tools, before the first connection.

Only stage 0 and stage 1 are broken into small tasks so far. Break down each later stage when we reach it, with the same brainstorming, plan, tests-first flow.

## Next step

### Start here in a fresh session: Q&A in Telegram (stage 5)

Why: the client wants to ask questions in the Telegram chat, not only read the digest. Ahmed moved this ahead of stages 3 and 4 (Nov 25).

Steps:
1. Read the official Claude Code channels docs (code.claude.com/docs) and say which page each claim comes from. Do not answer from memory.
2. Known problem: the plugin needs a Claude Code session that stays open. A scheduled cloud run starts, finishes and closes. Ahmed's computer sleeps and he has no server. Plan: try it on Ahmed's computer while it is awake. Where it lives for the real client stays a stage 6 decision.
3. Use the brainstorming skill. Design in chat, one question at a time. No design files in git.
4. Finish test (agreed earlier): every answer cites sources. Hard rules still apply: no "buy now" or "sell now", no number without a source, never an order.

Running by itself, check when Ahmed sends what arrived:
- Nov 26 (Thanksgiving, 06:50 Moscow): closed-day message, no record written. Check it reads well, that `requests` was already installed (setup script), and the cost of a closed-day run.
- Nov 27 (first normal day): first run with `save-result` and records. Check the digest arrived, the run transcript shows `save-result` `"ok": true` for each stock, the run's last line says records saved, branch `claude/records` has `records/2026-11-27.json`, and `main` did not move. If a records step failed, the last line names it (pull, compare, save, push). Check the cloud git wording for a missing branch first (the code looks for `couldn't find remote ref`).
- Nov 30: first real compare against a saved day (`previous_date` is Nov 27).
- Ahmed deletes the test branches `claude/records-test` and `claude/epic-tesla-swg03d` on GitHub.
- Ahmed decides whether Nov 26 counts in the 5-day test (proposed: no).

### Other work that does not wait on anyone

1. The Nov 26 and Nov 27 runs: see "Running by itself" above.
2. Tiny fix: tell the `daily-digest` skill not to send phone notifications.
3. Check NVDA, AAPL, KO numbers and the news side against their sources by hand.
4. Find where the $3,58 per run goes, split by role, from the Nov 25 run transcript.
5. Check Finnhub's real limits with a real call and its rate-limit headers.
6. Ahmed decides whether Nov 26 counts in the 5-day test (proposed: no).
7. Stage 7 prep, research only: read the Tradernet MCP server's tool list and write the order tools to block. Nothing connects.
8. Stage 3 prep: brainstorm in chat where the 2 to 3 candidate stocks come from (one question at a time). No code before the stage 2 test passes.

### Waiting on the client (Ahmed asks)

Digest time, layout, Russian or English headlines in the normal digest.

## Open questions

- Tradernet read-only keys and tool names.
- Client's watchlist, digest time, and whether stocks only.
- Price for the client.
- Whose Claude subscription runs the agent (recommended: the client's own).
