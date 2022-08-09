import type { KitaConfig } from '@kitajs/core';

export function filterRoute(filepath: string, config: KitaConfig) {
  const filtered = filepath
    .replace(new RegExp(config.controllers.prefix), '')
    .replace(/\.ts$/, '');

  const routePath =
    '/' +
    // replaces [param] syntax to :param
    filtered
      .replace(/(\[.+?\])/g, (match) => `:${match.substring(1, match.length - 1)}`)
      // removes index from name
      .replace(/\/?index\/?/gi, '/')
      // remove trailing slash
      .replace(/\/$/, '');

  const controllerName =
    (filtered
      // remove dashes
      .replace(/-/g, '')
      // transform params
      .replace(/\[|\]/g, '$')
      // camel case paths
      .split('/')
      .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
      .join('') ||
      // Defaults to Index
      'Index') +
    // include controllers
    'Controller';

  return { routePath, controllerName };
}
