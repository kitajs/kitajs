import type { Level } from 'pino';

/** Environment variables */
export interface Environment {
  /**
   * @default 1227
   * @minimum 1
   * @maximum 65535
   */
  PORT: number;

  /** @default '0.0.0.0' */
  HOST: string;

  /** @default 'trace' */
  LOG_LEVEL: Level;

  /** @default 'development' */
  ENV: 'test' | 'development' | 'production';
}
