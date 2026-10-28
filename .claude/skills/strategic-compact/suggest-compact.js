#!/usr/bin/env node
// suggest-compact.js
// Tracks tool calls in a session and suggests /compact at strategic thresholds.
// Runs as a PreToolUse hook on Edit and Write tool calls.

const fs = require('fs');
const path = require('path');
const os = require('os');

const COUNTER_FILE = path.join(os.homedir(), '.claude', 'compact-counter.json');
const THRESHOLD = parseInt(process.env.COMPACT_THRESHOLD || '50', 10);
const REMINDER_INTERVAL = 25;

// Read current state
let state = { count: 0, date: '' };
try {
  const raw = fs.readFileSync(COUNTER_FILE, 'utf8');
  const parsed = JSON.parse(raw);
  const today = new Date().toDateString();
  // Reset counter if it's a new day (new session proxy)
  if (parsed.date === today) {
    state = parsed;
  }
} catch (e) {
  // File doesn't exist yet or is malformed — start fresh
}

// Increment
state.count++;
state.date = new Date().toDateString();

// Persist
try {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(state), 'utf8');
} catch (e) {
  // If we can't write, still proceed — don't block tool calls
}

// Suggest compaction at threshold and every REMINDER_INTERVAL after
if (state.count === THRESHOLD) {
  process.stderr.write(
    `[strategic-compact] ${state.count} tool calls this session. Good time to run /compact before continuing.\n`
  );
} else if (state.count > THRESHOLD && (state.count - THRESHOLD) % REMINDER_INTERVAL === 0) {
  process.stderr.write(
    `[strategic-compact] ${state.count} tool calls. Context may be getting heavy — consider /compact.\n`
  );
}

// Always exit 0 so the hook never blocks tool execution
process.exit(0);
