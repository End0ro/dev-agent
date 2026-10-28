---
name: eval-harness
description: Use before building a feature that must be proven, not just finished. Define the pass/fail checks first, run them, and report numbers. Use for the memory helper's key claims, such as "notes reduce file rereading" and "hooks inject after /compact and /clear".
---

# Eval Harness

Evals are the unit tests for claims about agent behavior. Write them before the code, run them after, and report numbers.

Adapted from the eval-harness skill in `WorldFlowAI/everything-claude-code` (MIT), cut down to what this project needs.

## When to use

- A feature claims to change how Claude behaves (injects context, reduces rereading, survives /compact).
- You are about to say "it works" and the proof is not a normal unit test.

Plain code with plain tests does not need this. Use test-driven-development.

## The steps

1. **Define before coding.** Write the claim, the task, the pass/fail check, and how many runs.
2. **Prefer code graders.** A script that counts or greps beats a model's opinion. Use a model grader only for open-ended output, and say so in the report.
3. **Run it.** Record every run, including failures.
4. **Report numbers.** Not "looks good".

## Eval definition template

```
EVAL: <name>
Claim: <one sentence>
Task: <exact prompt or steps>
Check: <script or command that prints PASS or FAIL>
Runs: <n>
Pass bar: <e.g. 3 of 3, or at least 2 of 3>
```

## Metrics

- **pass@k:** at least one success in k tries. Use for "can it do this at all".
- **pass^k:** all k tries succeed. Use for things that must be reliable, like hooks firing.
- Name the numbers you used. "3/3 runs" is clearer than a percentage on small samples.

## Evals for this project

**1. Hooks survive /compact and /clear** (pass^3)
- Check: ask "What is the secret word?" after /compact, then after /clear. Answer must contain MARKER-7431.
- Run by hand in a real Claude Code session. Say that in the report.

**2. Notes reduce file rereading** (A/B)
- Same task, same repo state, two arms: with notes injected, without.
- Check: count Read/Grep/Glob tool calls on project files per run. Fewer is better.
- Run each arm at least 3 times. One run proves nothing.
- Also check the answer is still correct. Fewer reads with a wrong result is a failure.

**3. Stale notes are not injected**
- Edit a noted file, start a new session.
- Check: the note for that file is absent from the injected context.

## Report template

```
EVAL REPORT: <name>
Runs: <n>   Passed: <k>   Metric: pass@/pass^ <value>
Per run: <short line each, including failures>
Grader: code | model | human
Verdict: holds | does not hold | not enough runs
```

## Rules

- Never change the check after seeing results to make it pass.
- If the eval fails, say so. A failed eval is a result, not a problem to hide.
- Keep evals fast. A slow eval stops getting run.
