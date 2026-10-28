---
name: create-subagent
description: Use when creating a new subagent, designing a custom agent skill, or building a specialized agent for a recurring task.
argument-hint: "[agent purpose or name]"
---

# Create Subagent Skill

## What This Skill Does

Guides creation of a new Claude Code subagent skill from scratch.
Covers: purpose, tool access, model selection, isolation, prompt writing, and file output.

---

## Step 1: Discovery

If $ARGUMENTS is provided, use it as the agent's purpose and skip directly to Step 2.

Otherwise, ask via AskUserQuestion (one message, all questions at once):

- What does this subagent specialize in? (one sentence)
- What should it output or produce?
- What tools does it need? (Read/Grep/Glob only? Bash? Web? All?)
- Should it run isolated from conversation history? (yes/no)
- Preferred model: fast (haiku), balanced (sonnet), powerful (opus)?

---

## Step 2: Design Decisions

Based on discovery answers, decide:

| Field | Logic |
|-------|-------|
| `name` | lowercase-hyphenated, matches the agent's purpose |
| `context` | `fork` if isolated=yes; omit otherwise |
| `model` | `haiku` (cheap/fast tasks), `sonnet` (default), `opus` (complex reasoning) |
| `allowed-tools` | list only what's actually needed; omit to inherit all |
| `agent` | `general-purpose` (default), `Explore` (read-only research), `Plan` (architecture) |

Model guidance:
- Read-only research, summaries, quick lookups → haiku
- Code generation, multi-step tasks, tool use → sonnet
- Architecture, design review, complex judgment → opus

---

## Step 3: Write the Agent's Instructions

Craft the subagent's system prompt with these sections:

**Role** - One sentence: what this agent is and does.

**Input** - How it receives work: `$ARGUMENTS`, a specific file, or context it reads.

**Steps** - Numbered, specific. Each step is an action, not a description.

**Output** - Exact format: file path convention, structured text, or what it returns.

**Constraints** - What it must NOT do. Scope limits. Hard stops.

Keep the full SKILL.md under 150 lines so it fits cleanly as a subagent prompt.
If the agent needs reference material, create a `reference.md` in the same folder.

---

## Step 4: Write the File

Create `.claude/skills/[name]/SKILL.md` using this template:

```
---
name: [name]
description: Use when [trigger phrase 1], [trigger phrase 2], or [trigger phrase 3].
argument-hint: "[what to pass as argument]"
context: fork
model: [haiku|sonnet|opus]
allowed-tools: [comma-separated tools]
---

# [Agent Name]

## Role
[One sentence: what this agent specializes in]

## Input
$ARGUMENTS (or: reads from [source])

## Steps
1. [First action]
2. [Second action]
3. [Continue as needed]

## Output
[Exact format: file path, structure, or describe what is returned]

## Constraints
- [What it must not do]
- [Scope limits]
```

Remove `context: fork`, `model`, or `allowed-tools` lines if not needed.

---

## Step 5: Register in CLAUDE.md

Add one line to the Current skills list in `CLAUDE.md`:

```
- /[name] - [one-line description of what it does]
```

---

## Step 6: Confirm

Tell the user:
- File created at: `.claude/skills/[name]/SKILL.md`
- How to invoke: `/[name]` or describe the natural language trigger
- Next step suggestion: test by invoking with a sample input

---

## Notes

- `context: fork` = agent won't see conversation history. Make its prompt fully self-contained.
- If `allowed-tools` is omitted, the agent inherits all tools from the parent context.
- For read-only research agents, set `allowed-tools: Read, Grep, Glob` and `agent: Explore`.
- After building, audit quality with `/skill-builder` if unsure.
- Never hardcode API keys. Use environment variables and document which ones are required.
