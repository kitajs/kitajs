import Emittery from 'emittery';
import { KitaEvents } from './events';

/**
 * A global async event system used to communicate between parsers, generators, formatters and other components.
 */
export class KitaEventEmitter extends Emittery<KitaEvents> {}
