const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const { resolveLocalPaths } = require("../dist/local-path.js");

test("a file in the current directory is passed on as an absolute path", (t) => {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "tb-open-")));
  fs.mkdirSync(path.join(dir, "docs"));
  fs.writeFileSync(path.join(dir, "report.html"), "<h1>hi</h1>");
  fs.writeFileSync(path.join(dir, "docs", "index.html"), "<h1>hi</h1>");
  const previous = process.cwd();
  process.chdir(dir);
  t.after(() => process.chdir(previous));

  assert.deepEqual(resolveLocalPaths(["report.html"]), [path.join(dir, "report.html")]);
  assert.deepEqual(resolveLocalPaths(["docs/index.html", "--split-dir=right"]), [
    path.join(dir, "docs", "index.html"),
    "--split-dir=right",
  ]);
  assert.deepEqual(resolveLocalPaths(["example.com", "localhost:3000"]), ["example.com", "localhost:3000"]);
});
