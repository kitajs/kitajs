import { KitaConfig } from '@kitajs/common';
import path from 'node:path';

/** Removes enclosing quotes */
export function unquote(str: string) {
  return str.replace(/['"`](.*?)['"`]/g, '$1');
}

export function opt(optional = false) {
  return optional ? '?' : ('' as const);
}

export function findUrlAndControllerName(filepath: string, config: KitaConfig) {
  let strip = filepath;

  // Strips any possible regex that the user might have added
  strip = strip.replace(new RegExp(config.controllers.prefix), '');

  // Keeps everything before first . (removes extensions like .test.ts or .js)
  strip = strip.split('.')[0]!;

  // Replaces spaces with dashes
  strip = strip.replace(/\s|\./g, '-');

  // Replaces [param] syntax to :param
  let url = strip.replace(/(\[.+?\])/g, (match) => `:${match.substring(1, match.length - 1)}`);

  // Removes index from name
  url = url.replace(/\/?index\/?/gi, '/');

  // Remove trailing slash
  url = url.replace(/\/$/, '');

  // Adds leading slash
  url = '/' + url;

  // Removes a/[b]/c -> a/b/c
  let controller = strip.replace(/\[(.+?)\]/g, '$1');

  // Camel case paths or dash case paths
  controller = controller
    .split('/')
    .flatMap((p) => p.split('-'))
    .map(capitalize)
    .join('');

  // Defaults to Index
  controller = controller || 'Index';

  // Adds Controller suffix
  controller = controller + 'Controller';

  return { url, controller };
}

export function capitalize(this: void, str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Treats a type string to be a valid javascript oject */
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
