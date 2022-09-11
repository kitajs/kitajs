import { NodeResolver } from './base';
import { RestResolver } from './rest';
import { WebsocketResolver } from './websocket';

if (NodeResolver.resolvers.length === 0) {
  NodeResolver.resolvers.push(new RestResolver(), new WebsocketResolver());
}
