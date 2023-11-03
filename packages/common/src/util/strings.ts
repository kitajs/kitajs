export function capitalize(this: void, str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** The same as {@linkcode capitalize} but does not care if the remaining string is capitalized or not. */
export function capital(this: void, str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
