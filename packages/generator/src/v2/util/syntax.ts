import { BaseParameter } from '../models';
import { join } from './generation';

export const VALID_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

/**
 * Builds a property access string from a list of names.
 */
export function buildAccessProperty(...names: string[]) {
  let expr = '';

  for (const name of names) {
    if (name.match(VALID_IDENTIFIER)) {
      if (expr) {
        expr += '.';
      }

      expr += name;
    } else {
      expr += `[${JSON.stringify(name)}]`;
    }
  }

  return expr;
}

/**
 * Removes quotes from a string.
 */
export function unquote(str: string) {
  return str.replace(/^['"`]|['"`]$/g, '');
}

export function joinParameters(parameters: BaseParameter[]) {
  return join(
    parameters,
    (p) => /* ts */ `
     ${p.helper};

     if (reply.sent) {
       return;
     }
    `,
    (p) => !!p.helper
  );
}
