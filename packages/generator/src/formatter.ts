import { AstCollector, KitaConfig, SourceFormatter, SourceWriter } from '@kitajs/common';
import { Promisable } from 'type-fest';

export class KitaFormatter implements SourceFormatter {
  readonly writer: SourceWriter;

  constructor() {}

  parse(collector: AstCollector, config: KitaConfig): Promisable<void> {}

  flush(): Promisable<void> {}
}
