import path from 'path';
import type { KitaConfig } from '../config';

/** Removes enclosing quotes  */
export function unquote(str: string) {
  return str.replace(/['"`](.*?)['"`]/g, '$1');
}

export function opt(optional = false) {
  return optional ? '?' : ('' as const);
}

export function findUrlAndController(filepath: string, config: KitaConfig) {
  const strip = filepath
    // Strips any possible regex that the user might have added
    .replace(new RegExp(config.controllers.prefix), '')
    // keeps everything before first . (removes extensions like .test.ts or .js)
    .split('.')[0]!
    // Replaces spaces with dashes
    .replace(/\s|\./g, '-');

  return {
    url: `/${
      // replaces [param] syntax to :param
      strip
        .replace(/(\[.+?\])/g, (match) => `:${match.substring(1, match.length - 1)}`)
        // removes index from name
        .replace(/\/?index\/?/gi, '/')
        // remove trailing slash
        .replace(/\/$/, '')
    }`,

    controller: `${
      // transform params
      strip
        .replace(/\[|\]/g, '_')
        // camel case paths or dash case paths
        .split('/')
        .flatMap((p) => p.split('-'))
        .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
        .join('') ||
      // Defaults to Index
      'Index'
    }Controller`
  };
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Treats a type string to be a valid javascript oject*/
export function prepareTypeAsObject(
  type: string,
  route?: {
    controllerPath: string;
    controllerName: string;
    preparePath: (path: string) => string;
  }
) {
  if (route) {
    // Replaces `typeof import('...')` with require('...')
    type = type.replace(
      /typeof import\(['"](.*?)['"]\)/g,
      (_, importPath) =>
        `require('${route.preparePath(
          path.resolve(
            // controllerPath supports paths with line numbers (e.g. /path/to/file.ts:1:2 -> /path/to)
            path.dirname(route.controllerPath),
            importPath
          )
        )}')`
    );

    // Replaces `typeof localMethod` to `ControllerName.localMethod`
    type = type.replace(/typeof (\w+);?/g, `${route.controllerName}.$1`);
  }

  // Replaces the last semicolon with a comma of each line
  type = type.replace(/(?<!\\)[;,]\s*$/gm, ',');

  // Removes trilling spaces
  type = type.trim();

  // Removes the last semicolon or comma
  type = type.replace(/(?<!\\)[,;]\s*$/, '');

  // Fixes escaped semicolons
  type = type.replace(/\\([;,]\s*)/gm, '$1');

  return type;
}
