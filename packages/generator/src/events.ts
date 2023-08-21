import EventEmitter from 'node:events';
import type TypedEmitter from 'typed-emitter';
import type { KitaError } from './errors';
import type { BaseProvider, BaseRoute } from './models';

export const KitaEmitter = EventEmitter as new () => TypedEmitter<KitaEvents>;

export type KitaEvents = {
  error: (error: unknown) => void;
  'kita-error': (error: KitaError) => void;
  route: (route: BaseRoute) => void;
  provider: (provider: BaseProvider) => void;
};
