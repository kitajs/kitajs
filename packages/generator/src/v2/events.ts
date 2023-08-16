import type { BaseProvider, BaseRoute } from './models';
import type { KitaError } from './errors';

export type KitaEvents = {
  error: (error: unknown) => void;
  'kita-error': (error: KitaError) => void;
  route: (route: BaseRoute) => void;
  provider: (provider: BaseProvider) => void;
};
