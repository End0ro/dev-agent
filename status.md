# Status

Last updated: 2026-11-26, morning (stage 4c built, reviewed and MERGED into the client repo `main` as PR #23, 463 tests pass; see "Stage 4c result" under "Next step". Before that, Nov 25 night: stage 4b built, reviewed and MERGED into the client repo `main` as PR #22 at Ahmed's request, 367 tests pass; stage 2 built, run 1 done, run 2 is the Nov 27 timer. Plan changed the same evening: urgent-first reports twice a day come before Q&A, and the dashboard is built last. See "Plan" below. Stage 4a is built and reviewed on the client repo branch `claude/bold-pasteur-ri8b6u` (8 commits, 270 tests pass, pushed, PR #20 merged).)

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
- Ahmed lowered the stage 1 finish test from 3 messages to 2, 5 minutes apart. Recurring (daily) runs are not proven yet. Stage 2 (2 normal-day runs in a row, shortened Nov 25) covers that.
- Telegram token and chat ID are plain environment variables (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) on the cloud environment "Stock Market Agent". Anyone who uses that environment can read them. Reason: cloud network secrets only add headers, and Telegram wants the token in the URL. `api.telegram.org` is added to that environment's allowed hosts. Ahmed typed the values himself, never in chat.
- Ahmed decided Nov 25: everything the client reads is in Russian, headlines included. Where the Russian text comes from is still open.
- Ahmed decided Nov 25: while we build, Ahmed pays for the runs. Whose subscription pays after that is a stage 6 question.
- Ahmed decided Nov 25: Q&A in Telegram (stage 5, official plugin) is designed next, before stages 3 and 4, because the client wants to ask questions. The stage 2 test runs in the background, so building does not wait for it.
- Ahmed decided Nov 25: the stage 2 finish test is shortened from 5 days to 2 normal market days in a row, because he cannot wait until the end of the week. Run 1: Ahmed presses Run now on the `Daily digest` routine on Nov 25. Run 2: the timer on Fri Nov 27 (Nov 26 is Thanksgiving, a closed-day message that does not count). Pass: no wrong numbers, the report check passes both times, run 1 saves a record and run 2 compares against it. Trade-off: two runs prove the cloud path works but say less about day-to-day stability than five.
- Ahmed decided Nov 25: when the US market is closed, the agent still tracks the news and sends a message that the market is closed, with the reason. Built and merged the same day (see below). Weekends stay silent.

## Decisions, Nov 25 late evening (new reports)

- Two reports a day, Monday to Friday, all in Moscow time. 11:00 is the full report ("Утренний отчет"). 20:00 is a short "what changed since 11:00" report ("Вечерний отчет" is my proposed title, Ahmed has not objected).
- Urgent news go inside the reports. No real-time watcher for now (the client asked for it this way). The watcher research (Cloudflare Workers, a small server, the `/fire` endpoint, a Haiku headline filter, one or two publishers) is parked, not thrown away.
- Each report starts with an urgent section: a price alert (warning: down 5% in a day; urgent: down 10% in a day or 15% from the 20-day high) and new high-severity news. Each item says what happened, how serious it is, the risk in plain words, and the options. Never "buy now" or "sell now". Ahmed: "explain the risks".
- 20:00 report: only the news and price check per stock. Full analysis (bull, bear, risk checker) runs only for a stock with a high-severity item or an alert crossing. A quiet day is two lines. The price is labeled "price at 20:00, market open".
- US holidays: one closed-day message at 11:00 with the news and the last close price. Nothing at 20:00. Weekends stay silent.
- Report rules: Russian only, except stock tickers. "Remove brackets" means only the English word in brackets in the verdict line ("наблюдать (watch)" becomes "наблюдать"). Ahmed confirmed Nov 25. The `[n]` source tags stay, because the report checker needs a source marker on every line with a number. "Утренний отчет" replaces "Утренний дайджест".
- Dashboard: the report becomes an interactive dashboard, built last, together with Ahmed. Telegram will then send only "report is ready" plus the link. Until the dashboard exists, Telegram keeps the full text. Open: the ready message may need an urgent flag word, because urgent items would only be visible in the dashboard.
- Dashboard hosting test, Nov 25: a Claude artifact. A scheduled cloud run with nobody in the chat updated its data file by itself (run 3, 14 seconds, status succeeded). Test page: https://claude.ai/artifact/2gfofrJUtUDgjBypRUooZE (private, only Ahmed can open it). Not tested: a real report run doing it, sharing with the client, and how the page looks on a phone. Cloudflare Pages was researched and is the fallback if the artifact fails. A public page link must be solved before the real portfolio.
- Merge rule: first plan was no merge into the client repo `main` before the Nov 27 run is checked (the routine reads `main`). Ahmed then asked to merge stage 4a at once (Nov 25 late evening): PR #20 is merged. So Nov 26 (closed-day message with prices) and Nov 27 (urgent section with records) are the first cloud runs of the 4a code, and the Nov 27 test proves stage 2 and 4a together. The routine itself is not changed until 4d. That rule is replaced (Nov 25 night, Ahmed, twice): merge PRs right away, never hold them for a later check, and instead send more progress updates. When a PR is ready, merge it and say so. Merge only PRs I opened for the work Ahmed asked for.

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
  - The run rebuilt the result JSON files by hand and shortened some fields (the bear's `answers_to_bull` is a placeholder in NVDA, AAPL, TSLA). Cause found Nov 25 (read from the TSLA part of the run, the last 33 events only): `analyze-stock` step 8 says "write the result JSON", but no command does it. The main agent typed the whole file by hand in a Python heredoc, at the end of a long four-stock run. It shortened the bull and bear claims, wrote `answers_to_bull` as the text "(...abridged here)" instead of a list, and typed `report_check` itself (copied from the skill's example). `check-report` did run. No code checks the shape of the result file, so nothing stopped it. Not yet checked for NVDA, AAPL, KO. Fix built and merged Nov 25 (client repo PR #11, in `main` with #12): `python -m tools save-result` builds the file from the six role outputs, runs the report check itself and rejects bad shapes (exit 1, no file). Step 8 of the skill calls it. 160 tests pass. All 13 old NVDA result files rebuild identically. Not tried in a cloud run yet (first run with it: Nov 25 by hand, or the Nov 27 timer run). Limit: text shortened inside a valid shape is not caught.
  - The run sent itself a phone notification nobody asked for. The Stop hook asked it to commit and push and it correctly declined.
- Ahmed's feedback on the digest: too much in it, poorly structured, hard for the client to read. Main faults: the stock that needs attention is not first, no reason shown, English headlines in a Russian message, `[n]` tags on every line, repeated "серьёзно", verdict in two languages. Proposed layout (not built): attention first with a short reason, then one line per calm stock. Waiting for the client's answer.

## Open, not done

- Stage 2 is not finished. The finish test was shortened Nov 25 by Ahmed to 2 normal market days. Run 1 is his Run now press on Nov 25, run 2 is the Nov 27 timer run. Nov 26 (Thanksgiving) does not count.
- Client questions (Ahmed asks): digest time, layout, headlines in Russian or not.
- Rebuild the digest layout after the client answers. Add the price alert level (NVDA was 27,86% below its 20-day high on Nov 25).
- Check the digest numbers against their sources by hand. TSLA done Nov 25: the tools output (price, numbers, P/E) matches the hand-typed result file on every number. That is tools against file, not against the Yahoo page or the SEC filing, and the news side is not checked. NVDA, AAPL, KO not checked.
- Where Russian text for the reason line and headlines comes from (model translation checked by the report check, or lines from the Russian report).
- No "changed from yesterday" in the digest: cloud sessions start empty.
- Records idea (Ahmed, Nov 25): keep each day's result files so the next run can read yesterday. It would give: verdict changes with a reason, "new today" vs repeated news, and later a check of verdicts against what the price did next. How: the run saves its files to a branch of the client repo and the next run reads them. First step, a cheap test that a cloud run can push: passed Nov 25. The first version is built (see "Daily records" above) and does not change the digest text, so it does not touch the stage 2 test. Still open: use the compare result in the digest (verdict change, "new today") once the client answers on layout. Changing the digest text during the stage 2 test may restart it: Ahmed decides.
- Scheduled task limits (official docs, code.claude.com/docs/en/web-scheduled-tasks, read Nov 25): a schedule that runs more often than once per hour is rejected, so decision 6 (news every 15 minutes) cannot use the timer. Up to 100 scheduled runs per hour per account, and every run draws on the subscription like a normal session. A task can also be started by an HTTP POST to its own `/fire` endpoint with a bearer token (beta), and by GitHub events. A run pushes to a branch prefixed `claude/` by default unless the prompt says otherwise (our `Daily digest` prompt says do not push). The page says nothing about a maximum run time or overlapping runs. Idea for stage 4, not designed: free code outside Claude watches prices and headlines every few minutes and fires the Claude task only when something changed. That needs a timer that works (the GitHub Actions timer never fired in our test) and memory of what was already seen (the records idea).
- Instagram idea (Ahmed, Nov 25): one Claude prompt plus Airtable gives a Magnificent 7 table with a 0 to 10 score and buy/hold/sell. Not for us as is: it breaks our rules (no buy/sell calls, no number without a source) and has no checks, no timer, no Telegram. Two parts worth keeping: a table of all stocks and history (a possible home for the records idea; Airtable from a cloud run is untested and its AI billing is unknown), and market sentiment as a labelled extra with a source, later.
- Cost: about $3.58 a run is about $75 over 21 weekdays at list price (my estimate). Ahmed pays while building. Whose subscription pays after that is still open.
- The token is a plain environment variable, not a network secret. Fine for Ahmed alone, revisit for the client.
- Finnhub limit checked Nov 26 with a real `company-news` call: 60 calls per minute (`X-Ratelimit-Limit: 60`). Only `tools/news.py` calls Finnhub, one call per stock per run, so a morning run uses 4 and the evening check 4 more. Far under the limit. Daily or monthly caps are not shown in the headers, not checked.
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
- Stage 2, daily digest on the made-up portfolio (KO, NVDA, AAPL, TSLA). Russian report per stock, one digest message, in Telegram. Finish test (shortened by Ahmed Nov 25 from 5 days): 2 normal market days in a row, no wrong numbers, the report check passing both times, and the second run comparing against the record of the first. Use a placeholder digest time until the client answers.
- Stage 3, weekly review with 2 to 3 candidates. Finish test (proposed, none in the context file): one review where every candidate has sources and nothing says "buy now". Order of work: after stage 5.
- Stage 4, urgent-first reports (changed Nov 25, replaces "urgent alerts"). NEXT. Backend only, no dashboard. Four plans, each built on a branch with tests first:
  - 4a, urgent section. BUILT and MERGED Nov 25 (PR #20). Price alert level (warning/urgent), new high-severity news, no repeats of news already sent, last close price in the holiday message. Report text rules: Russian only except tickers, no English word in brackets in the verdict line, `[n]` source tags stay, title "Утренний отчет". The run also writes the report as a data file (JSON) for the future dashboard. A scratch prototype of the old version passed 259 tests, but its layout changes under the new rules, so it is a reference only.
  - 4b, Russian risk text and options per urgent item. BUILT and MERGED Nov 25 night (PR #22, Ahmed asked for the merge right away). Decided by Ahmed Nov 25: a new small agent `risk-explainer` writes the two lines, only for a stock with urgent items (not the risk-checker, whose JSON broke before). Code checks each text and swaps in a fixed safe line if it is missing or fails. See "Stage 4b result" below.
  - 4c, BUILT and MERGED Nov 26 (PR #23, see "Stage 4c result"). The 20:00 short report and a second record per day (morning and evening slots in `records/`), with "no repeats" working across both reports. Quiet day is two lines. Holidays send nothing at 20:00. Also fix a known limit from 4a: news sent in a holiday message comes back as urgent on the next trading day, because holidays write no record (Thanksgiving Nov 26 then Nov 27 is the first case). Other known limits from the 4a review: news hidden by the per-stock limit counts as seen the next day; the urgent price line has no date; a price alert repeats every day while a stock stays 15% below its 20-day high.
  - 4d, schedule switch: 11:00 and 20:00 Moscow time, Monday to Friday. Only after the Nov 27 run is checked and 4a to 4c are merged. Changes the `Daily digest` routine and adds a second routine.
  - Finish test for stage 4 (proposed, Ahmed has not seen it): (1) replay the saved NVDA inputs for Nov 11 and Nov 12: NVDA is first in the urgent section with an alert or news item, a risk line and options, and the report check passes; (2) a second run the same day shows no repeated news; (3) a quiet 20:00 run is two lines; (4) the holiday message has news and last close price; (5) a scan of all report text finds no English words except tickers.
- Stage 5, Q&A in Telegram. After stage 4. Scope still open: A) questions about the 4 stocks, B) any stock on demand, C) general market questions come back in later. Finish test: every answer cites sources. Needs a session that stays open (Ahmed's computer for now).
- Stage 5b, the dashboard (new, Nov 25). Last build step, before the client test. Built together with Ahmed. Reads the data file each report writes. Hosting: Claude artifact (test passed), fallback Cloudflare Pages. Then Telegram switches to "ready plus link". Finish test (proposed): after a real report run, the dashboard shows the new data on Ahmed's phone with no manual step.
- Stage 6, two-week test with the client. Needs: his watchlist, price, and whose Claude subscription runs it. The client's setup is decided here. The digest time is now decided (11:00 and 20:00 Moscow).
- Stage 7, his real Freedom account, read only, then live. Needs his Tradernet read-only keys. First step: add deny rules for order tools, before the first connection. Also solve who can open the dashboard link.

Order of work: stage 2 test (Nov 27), stage 4 (4a, 4b, 4c, then 4d), stage 5, stage 3, stage 5b, stage 6, stage 7. Only stage 0 and stage 1 were broken into small tasks before; stage 4 is split above, and each part gets its task list when we start it, with the same brainstorming, plan, tests-first flow.

## Next step

### Stage 4c result (Nov 26) and what is next

- Client repo PR #23, 9 task commits plus 4 fix commits, merged into `main` (merge commit 90ede0f), 463 tests pass (367 before). Built with subagents, a review after each task, a whole-branch review on the strongest model, and a re-review. The whole-branch review found 3 real problems that the task reviews could not see, all fixed before the merge: a second -6% day looked "not new" because the morning record holds the previous close; the header "Срочного нет." appeared when a check or analysis had failed; news the client never saw was saved as seen. A re-review then found that a half-failed analysis still passed as valid (failed roles give the verdict `review`), also fixed.
- What it does:
  - New skill `evening-report` (`.claude/skills/evening-report/SKILL.md`). Quick news and price check per stock, `python -m tools evening-check` decides in code who gets the full `analyze-stock`, `build-evening` builds the message. Nothing runs it by itself yet (stage 4d).
  - Full analysis only when: a new high-severity news item not in any earlier record, or a price alert that is new (worse level than the last record, or a new trading day with a day move of -5% or worse).
  - Quiet day is three lines: title "Вечерний отчет на DATE", "Срочного нет, с утреннего отчета ничего нового.", and the closing line. I changed the wording from "с 11:00" because the report check rejects digits without a source link. Ahmed has not seen this wording.
  - If a check or the full analysis failed, the header says "Срочное проверить не удалось, данных не хватает." and the stock line says "нет данных". Its news is not saved as seen.
  - Records now have slots: `DATE.json` (morning), `DATE-evening.json`, `DATE-closed.json`. A holiday message writes the closed record, so the Thanksgiving news will not come back as urgent on Nov 27. The no-repeat memory reads all earlier records. `records-save` and `records-push` take `--slot`, `urgent-items` takes `--slot evening`.
- Tried: replay of the saved NVDA Nov 12 data (same data at 20:00 gives the quiet message, a new high item gives a full run, holiday news is not urgent next day). Not tried in a cloud run.
- Known limits (also in `docs/context.md`, Stage 4c): the full run can disagree with the quick check and show a calm header; an exception inside the urgent pick is skipped; on early-close days in summer the label "рынок открыт" is wrong at 20:00 Moscow; old morning records have no alert level or close date, so the first evening after a morning run on old code costs one extra full analysis; if `records-pull` fails, old news may look new; the first morning after a holiday uses the closed record's date as the since-date. The evening skill has no fallback if the Telegram send fails.
- Not done: stage 4d (the schedule: 11:00 and 20:00 Moscow time, Monday to Friday, changes the `Daily digest` routine and adds a second one; needs the Nov 27 run checked first). Also still open from before: the whole-report English scan (stage 4 finish test, item 5).
- Next: check the Nov 27 run (see "Running by itself" below; the Nov 26 message is checked, see there). Then stage 4d, then stage 5 (Q&A in Telegram).

### Stage 4b result (Nov 25 night)

- Client repo PR #22, 5 commits, merged into `main` Nov 25 night (merge commit f8dc3da), 367 tests pass (270 before). Built with subagents, each task reviewed, then a whole-branch review on the strongest model and one fix commit. I first said to wait for the Nov 27 check, Ahmed said there is no point in delaying. So the Nov 26 and Nov 27 cloud runs are the first runs of the 4b code, and the Nov 27 test now proves stage 2, 4a and 4b together. If something breaks, the fix is a small PR on `main`.
- What it does: `python -m tools urgent-items` lists the urgent items. The `daily-digest` skill (new step 2b) runs the `risk-explainer` agent per stock with urgent items and saves `reports/explain-DATE.json`. `build-digest --explain` puts a Russian risk line and an options line under each urgent item. Without `--explain` the layout is unchanged.
- Text check in code (`tools/explain.py`): Russian only except tickers, no digits or number words, no links or brackets, no forbidden phrases, no "act now" commands, 220 and 160 characters. A failing or missing text becomes `Варианты: держать, наблюдать, сократить долю. Решение за вами.` The report always goes out. If the message is too long: news lines go first, then risk texts, then the safe lines.
- Finish test, replay of the saved NVDA inputs for Nov 11 and Nov 12, 5 agent runs each (run in this session, not in the cloud): 40 of 40 items accepted by the text check (again 40 of 40 after the stricter check from the review). The Nov 12 digest built with the real command, check passed, 3815 characters with 4 urgent items (limit 4096). My target of 8 of 10 was my own proposal, Ahmed has not seen it. Caveats: I copied the agent replies into files by hand, and I removed the source URLs from the `reason` text in the prompts.
- Review fixes done: the check did not catch "Продайте немедленно" or number words ("пять процентов"), now it does. Known limits (in `docs/context.md`): the "act now" check is a fixed word list and cannot judge meaning; fullwidth Latin letters and Cyrillic web addresses pass; an old `reports/explain-DATE.json` from the same day would be reused if step 2b is skipped; the shrink drops all risk texts, not one by one.
- Not covered: English words inside `headline_ru` (company names in Latin are allowed there). The whole-report English scan (stage 4 finish test, item 5) is still open. First cloud run of this code: Nov 27 (urgent items exist only if a price alert or new high-severity news shows up; on Nov 25 NVDA was 27,86% below its 20-day high, so likely).
- Small thing: the first commit of the branch (explain.py) has `Co-Authored-By: Claude Haiku 5.5` because a Haiku subagent wrote it. It is already pushed.
- Next: check the Nov 26 and Nov 27 runs (see "Running by itself"; on Nov 27 also check that step 2b ran, `reports/explain-DATE.json` was written, risk and options lines appear under the urgent items, and the cost). Stage 4c is done (see above). Publisher filter for news: decided "later" (Nov 25), all publishers stay.

Ahmed also takes the stage 5 (Q&A in Telegram) questions to a new session.

Background on 4a:

Stage 4a is built (client repo branch `claude/bold-pasteur-ri8b6u`, 8 commits on top of `main` at 0796d88, merged as PR #20, 270 tests pass, built with subagents, each task reviewed, plus a whole-branch review and one fix commit). It was pushed Nov 25 after Ahmed allowed it (the first tries were blocked by the permission check). PR #20 is merged into the client repo `main` (Nov 25, at Ahmed's request).

What 4a changed (all in the client repo):
- `tools/alerts.py` (new): alert level from day move and drop from the 20-day high.
- `tools/records.py`: `seen_urls`, `since_date` (ignores a bad record date).
- `tools/digest.py`: title "Утренний отчет на DATE", verdict without the English word, news lines use `headline_ru` (fallback text when missing), urgent section first ("Срочное:", max 4 items, or "Срочного нет."), no repeats inside one report, corrupt stocks do not use up slots.
- `tools/closed_day.py` and `tools/__main__.py`: holiday message shows last close prices; `build-digest --records-dir records`.
- `daily-digest` skill: `records-pull` before the analysis (step 1c) and `--records-dir records` in step 3. `analyze-stock` skill: verdict line has no English word.
- Dry run on the saved NVDA results for Nov 12: NVDA first in the urgent section with the price alert and news lines. The news lines show the fallback text because the old files have no `headline_ru`.
- Not proven in a cloud run. The routine reads `main`, so nothing runs it until the PR is merged after the Nov 27 check.

Steps:
1. PR #20 is merged (Ahmed asked for it Nov 25). Check the Nov 26 closed-day message and the Nov 27 run: they are the first cloud runs of the 4a code. If something breaks, the fix is a small PR on `main`.
2. Then stage 4b (risk text and options per urgent item, English-word check). Stack it on the 4a branch or wait for the merge. Use the writing-plans skill, plan in chat, then ask subagents or inline.
3. Tests first. Hard rules still apply: no "buy now" or "sell now", no number without a source, never an order.

Later, stage 5 (Q&A in Telegram), when we get there:
- Read the official Claude Code channels docs (code.claude.com/docs) and say which page each claim comes from. Do not answer from memory.
- Known problem: the plugin needs a Claude Code session that stays open. A scheduled cloud run starts, finishes and closes. Ahmed's computer sleeps and he has no server. Try it on Ahmed's computer while it is awake. Where it lives for the real client stays a stage 6 decision.
- Brainstorm in chat, one question at a time. Finish test: every answer cites sources.

Run 1 of the stage 2 test, Nov 25 (Ahmed pressed Run now, about 14:30 UTC): the first try failed at `market-status` (`No module named 'requests'`, nothing sent, nothing written, and it sent a phone notification nobody asked for). The setup script on "Stock Market Agent" had not installed it, and we do not know why (the script text could not be read from here). Fix: client repo PR #18 (step 0 of the `daily-digest` skill installs `requests` from `requirements.txt` if missing, and no phone notifications). Second try: the digest arrived (Ahmed said so, he did not send the text or the last line of the run). Checked from the branch: `claude/records` exists with `records/2026-11-25.json` (4 stocks: KO watch, NVDA review, AAPL watch, TSLA watch), and `main` did not move. So the cloud push to a missing branch worked, including the orphan-branch path.

Not checked on run 1: the digest numbers against sources, the run's last line, and whether step 0 or the setup script installed `requests`. One oddity in the record: `close_date` is Nov 24 for KO and NVDA but Nov 25 for AAPL and TSLA, because the run was near the US open. Check on Nov 27 that all four dates match.

Running by itself, check when Ahmed sends what arrived:
- Nov 26 (Thanksgiving, 06:50 Moscow): closed-day message sent. It ran before 4c was merged, so it wrote no record. I wrote `records/2026-11-26-closed.json` by hand on `claude/records` (Nov 26, Ahmed said yes): the 3 news items shown in the message (NVDA 2 high, TSLA 1 medium), not the cut third NVDA item. So Nov 27 should not repeat them as urgent. Prices in the message matched the tools output. It does not count in the stage 2 test. Still unchecked: cost of a closed-day run, headline wording, news severity.
- Nov 27 (half day, market open): run 2 of the stage 2 test and the first real compare (`previous_date` is Nov 25). Check the digest arrived, the transcript shows `save-result` `"ok": true` for each stock, the last line says records saved and shows the compare result, branch `claude/records` has `records/2026-11-27.json`, `main` did not move, and all four `close_date` values match. If both runs pass, stage 2 is done.
- Nov 30 onward: the timer keeps running and each normal day adds a record.
- Ahmed deletes the test branches `claude/records-test` and `claude/epic-tesla-swg03d` on GitHub.

### Other work that does not wait on anyone

1. The Nov 25, Nov 26 and Nov 27 runs: see "Running by itself" above.
2. DONE Nov 25 (client repo PR #18): the `daily-digest` skill now says not to send phone notifications.
3. Check NVDA, AAPL, KO numbers and the news side against their sources by hand.
4. Find where the $3,58 per run goes, split by role, from the Nov 25 run transcript.
5. DONE Nov 26: Finnhub allows 60 calls per minute, we use 8 a day (see Open, not done).
6. Measure the real subscription cost: compare `/usage` before and after a run. Ahmed will go over prices in the next session.
7. Find out why the environment setup script did not install `requests` (Ahmed opens the "Stock Market Agent" environment, Edit, Setup script, and sends the text). Step 0 of the skill covers it for now.
8. Stage 7 prep, research only: read the Tradernet MCP server's tool list and write the order tools to block. Nothing connects.
9. Stage 3 prep: brainstorm in chat where the 2 to 3 candidate stocks come from (one question at a time). No code before the stage 2 test passes.

### Waiting on the client (Ahmed asks)

Digest time, layout, Russian or English headlines in the normal digest.

## Open questions

- Tradernet read-only keys and tool names.
- Client's watchlist, digest time, and whether stocks only.
- Price for the client.
- Whose Claude subscription runs the agent (recommended: the client's own).
