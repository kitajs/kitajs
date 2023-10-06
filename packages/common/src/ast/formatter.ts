import { Promisable } from 'type-fest';
import { KitaConfig } from '../config';
import { AstCollector } from './collector';

export interface SourceFormatter {
  /** Reads in all ast collected by the collector and formats them. */
  parse(collector: AstCollector, config: KitaConfig): Promisable<void>;

  /** Writes all the files to disk */
  flush(): Promisable<void>;
}
