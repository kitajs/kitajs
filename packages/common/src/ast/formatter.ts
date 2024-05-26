import type { AstCollector } from './collector';

export interface SourceFormatter {
  /** Called after all routes have been generated. This is the place to generate the runtime and everything it may needs. */
  generate(collector: AstCollector): Promise<void> | void;
}
