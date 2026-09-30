const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tb-cli-config-"));
process.env.TERMINAL_BROWSER_CONFIG_DIR = dir;
const { configCommand } = require("../dist/config.js");

function shortcut(id) {
  return JSON.parse(fs.readFileSync(path.join(dir, "shortcuts.json"), "utf8"))[id];
}

test("config set accepts chords on the comma key", () => {
  assert.equal(configCommand(["set", "shortcuts.settings.open", "cmd+,"]), 0);
  assert.equal(shortcut("settings.open"), "cmd+,");
  assert.equal(configCommand(["set", "shortcuts.settings.open", "ctrl+,,cmd+shift+,"]), 0);
  assert.deepEqual(shortcut("settings.open"), ["ctrl+,", "cmd+shift+,"]);
});

test("config set still splits a list of chords on commas", () => {
  assert.equal(configCommand(["set", "shortcuts.tab.new", "cmd+t, ctrl+t"]), 0);
  assert.deepEqual(shortcut("tab.new"), ["cmd+t", "ctrl+t"]);
  assert.equal(configCommand(["set", "shortcuts.zoom.in", "ctrl++,cmd+="]), 0);
  assert.deepEqual(shortcut("zoom.in"), ["ctrl++", "cmd+="]);
});
