import fs from "node:fs";
import path from "node:path";

export function resolveLocalPath(arg: string): string {
  return fs.existsSync(arg) ? path.resolve(arg) : arg;
}

export function resolveLocalPaths(argv: string[]): string[] {
  return argv.map((arg) => (arg.startsWith("-") ? arg : resolveLocalPath(arg)));
}
