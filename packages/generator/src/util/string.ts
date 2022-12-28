import type { KitaConfig } from '../config';

/** Removes enclosing quotes  */
export function unquote(str: string) {
  return str.replace(/['"`](.*?)['"`]/g, '$1');
}

export function opt(optional = false) {
  return optional ? '?' : ('' as const);
}

export function findRouteName(filepath: string, config: KitaConfig) {
  const strip = filepath
    // Strips any possible regex that the user might have added
    .replace(new RegExp(config.controllers.prefix), '')
    // Removes possible .ts extension
    .replace(/\.(t|j)sx?$/, '')
    // Replaces spaces with dashes
    .replace(/\s|\./g, '-');

  return {
    routePath: `/${
      // replaces [param] syntax to :param
      strip
        .replace(/(\[.+?\])/g, (match) => `:${match.substring(1, match.length - 1)}`)
        // removes index from name
        .replace(/\/?index\/?/gi, '/')
        // remove trailing slash
        .replace(/\/$/, '')
    }`,

    controllerName: `${
      // transform params
      strip
        .replace(/\[|\]/g, '$')
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
