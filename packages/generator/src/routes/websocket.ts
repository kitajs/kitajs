import type { BaseRoute } from './base';

/**
 * The websocket route is a route that is generated from a websocket controller.
 */
export interface WebsocketRoute extends BaseRoute {
  websocket: true;
  method: 'GET';
  controllerMethod: 'ws';
  templatePath: 'routes/websocket.hbs';
}
