/** Join code lines with a semicolon. */
export function join<I>(items: I[], mapper: (this: void, t: I) => string, filter?: (this: void, t: I) => boolean) {
  let code = '';

  for (const item of items) {
    if (filter && !filter(item)) {
      continue;
    }

    code += mapper(item).trim() + '\n';
  }

  return code;
}
