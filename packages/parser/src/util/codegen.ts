/**
 * Regex to check if a code don't needs to end with a semicolon.
 */
export const NO_SEMICOLON = /(\;|\}|\)|\(|\)|\]|\[)\n*$/;

/**
 * Trim and add a semicolon to the end of the code if needed.
 */
export function format(code: string) {
  code = code.trim();

  if (!code.match(NO_SEMICOLON)) {
    code += ';';
  }

  return code;
}

/**
 * Join code lines with a semicolon.
 */
export function join<I>(items: I[], mapper: (this: void, t: I) => string, filter?: (this: void, t: I) => boolean) {
  let code = '';

  for (const item of items) {
    if (filter && !filter(item)) {
      continue;
    }

    code += format(mapper(item)) + '\n';
  }

  return code;
}

/**
 * Render a code block if a condition is true.
 */
export function If(check: unknown, truthy: string | undefined = undefined, falsy = ''): string {
  return check ? truthy ?? String(check) : falsy;
}
