export const VALID_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

/**
 * Builds a property access string from a list of names.
 */
export function buildAccessProperty(...names: string[]) {
  return names.reduce(
    (acc, name) =>
      name.match(VALID_IDENTIFIER) ? `${acc}.${name}` : `${acc}[${JSON.stringify(name)}]`,
    ''
  );
}

/**
 * Removes quotes from a string.
 */
export function unquote(str: string) {
  return str.replace(/^['"`]|['"`]$/g, '');
}
