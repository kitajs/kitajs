import type { BaseRoute } from './base';

/**
 * The rest route is a route that is generated from a rest controller.
 */
export interface RestRoute extends BaseRoute {
  templatePath: 'routes/rest.hbs';
}
