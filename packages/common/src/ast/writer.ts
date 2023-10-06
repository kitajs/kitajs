import { Promisable } from 'type-fest';

/** A simple interface for writing raw typescript code and automatically transpiling them to javascript. */
export interface SourceWriter {
  /** Writes or appends content into a memory source file */
  write(filename: string, content: string): Promisable<void>;

  /** Writes all the files to disk */
  flush(): Promisable<void>;
}
