export function log(emoji: string, msg: string, extra?: unknown): void {
  console.log(`\n ${emoji}   ${msg}`);
  extra && console.log(extra);
}
