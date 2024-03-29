/** You can await this promise to make sure the runtime is ready and all cyclic imports are resolved. */
export declare const ready: Promise<void>;

export * from './plugin';

export * from './routes/getHello';
