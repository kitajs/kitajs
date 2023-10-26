import { KitaConfig } from '@kitajs/common';
import path from 'node:path';

export function findUrlAndControllerName(filepath: string, config: KitaConfig) {
  let strip = filepath;

  // Strips any possible regex that the user might have added
  strip = path.relative(config.routeFolder, filepath);

  // Keeps everything before first . (removes extensions like .test.ts or .js)
  strip = strip.slice(0, -path.extname(strip).length);

  // Replaces windows separators with /
  // strip = strip.replace(path.sep, '/');

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

/** The same as {@linkcode capitalize} but does not care if the remaining string is capitalized or not. */
export function capital(this: void, str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
