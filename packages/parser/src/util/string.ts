import { capitalize, kRoutesFolder, type KitaConfig } from '@kitajs/common';
import path from 'node:path';

const WIN32_SEP_REGEX = /\\/g;

export function parseUrl(filepath: string, config: KitaConfig) {
  let strip = filepath;

  // Strips any possible regex that the user might have added
  strip = path.relative(path.join(config.src, kRoutesFolder), filepath);

  // Keeps everything before first . (removes extensions like .test.ts or .js)
  strip = strip.slice(0, -path.extname(strip).length);

  // Replaces windows separators with /
  strip = strip.replace(WIN32_SEP_REGEX, '/');

  // Replaces spaces with underlines
  strip = strip.replace(/\s/g, '_');

  // Replaces [...] to *
  let url = strip.replace(/\[\.{3}\]/g, '*');

  // Replaces [param] syntax to :param
  url = url.replace(/\[(.+?)\]/g, ':$1');

  // Removes index from name
  url = url.replace(/(\/|^)index(\/|$)/g, '/');

  // Remove trailing slash
  if (url[url.length - 1] === '/') {
    url = url.slice(0, -1);
  }

  return {
    // Adds leading slash
    url: `/${url}`,

    // Camel case paths or dash case paths
    routeId:
      strip
        // Replaces [...] to Wilcard
        .replace(/\[\.{3}\]/g, 'Wildcard')
        // Replaces other parameters to their name
        .replace(/\[(.+?)\]/g, '$1')
        .split('/')
        .flatMap((p) => p.split('-'))
        .map(capitalize)
        .join('') || 'Index',

    controllerId: `${
      strip
        // Replaces [...] to Wilcard
        .replace(/\[\.{3}\]/g, 'Wildcard')
        // Removes a/[b]/c -> a/b/c
        .replace(/\[(.+?)\]/g, '$1')
        // Camel case paths or dash case paths
        .split('/')
        .flatMap((p) => p.split('-'))
        .map(capitalize)
        .join('') || 'Index'
    }Controller`
  };
}
