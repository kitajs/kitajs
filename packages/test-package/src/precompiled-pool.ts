import { Worker } from 'node:worker_threads';
import { deferred, Deferred } from 'fast-defer';
import os from 'node:os';

export type QueueItem<T = any> = { name: string; data: T; promise: Deferred<T> };

export const kWorkerQueueItem = Symbol('workerQueueItem');
export type kWorkerQueueItem = typeof kWorkerQueueItem;

console.log(__filename)

declare module 'worker_threads' {
  interface Worker {
    [kWorkerQueueItem]?: QueueItem;
  }
}

export class WorkerPool<N extends readonly string[]> {
  private readonly free: Worker[] = [];
  private readonly queue: QueueItem[] = [];

  private readonly code: string;

  constructor(
    code: string,
    fnNames: N,
    // Always a thread less than the number of CPUs
    threads: number = Math.max(os.cpus().length - 1, 1)
  ) {
    this.code = this.buildCode(code, fnNames);

    for (let i = 0; i < threads; i++) {
      this.createWorker();
    }
  }

  execute<D, R>(name: N[number], data: D): Promise<R> {
    const promise = deferred<R>();

    // There are no free workers, so we need to add the item to the queue
    if (!this.free.length) {
      this.queue.push({ name, data, promise });

      return promise;
    }

    const worker = this.free.pop()!;

    worker[kWorkerQueueItem] = { name, data, promise };
    worker.postMessage({ name, data });

    return promise;
  }

  unknownErrorHandler = (err: Error): void => console.error(err);

  private createWorker() {
    const worker = new Worker(this.code, { eval: true });

    // Worker sent a response, so we can add him into the free pool
    worker.on('message', ({ result, error }) => {
      if (result) {
        worker[kWorkerQueueItem]?.promise.resolve(result);
      } else {
        worker[kWorkerQueueItem]?.promise.reject(error);
      }

      this.lookForNext(worker);
    });

    // Handle errors
    worker.on('error', (error) => {
      this.unknownErrorHandler(error);
      worker.terminate().catch((err) => this.unknownErrorHandler(err));

      const newWorker = this.createWorker();
      this.lookForNext(newWorker);
    });

    // Add the worker to the free pool when online
    worker.on('online', () => {
      this.free.push(worker);
      this.lookForNext(worker);
    });

    // Handle process exit
    process
      .on('SIGTERM', () => worker.terminate())
      .on('SIGINT', () => worker.terminate());

    return worker;
  }

  private lookForNext(worker: Worker) {
    // Instead of adding the worker to the free pool, we can check if there is
    // something in the queue and if so, we can use the worker to execute the
    // next item in the queue
    if (this.queue.length) {
      const item = this.queue.shift()!;

      worker[kWorkerQueueItem] = item;
      worker.postMessage({
        name: item.name,
        data: item.data
      });

      return;
    }

    // Add the worker to the free pool and reset its queue item
    worker[kWorkerQueueItem] = undefined;
    this.free.push(worker);
  }

  private buildCode(code: string, fnNames: N) {
    return `${code};
    {
      const { isMainThread, parentPort } = require('node:worker_threads');
    
      if(isMainThread) {
        throw new Error('This code should only be executed in a worker thread');
      }
    
      parentPort.on('message', async ({ name, data }) => {
        switch(name) {
          ${fnNames.map(
            (name) =>
              `case '${name}':
            try {
              parentPort.postMessage({ result: await ${name}(data) });
            } catch(error) {
              parentPort.postMessage({ error });
            }
            
            break;`
          )}
        }
      })
    }`;
  }
}

new WorkerPool(`function add(a) { return Promise.resolve(a + 1); }`, ['add'] as const)
  .execute('add', 1)
  .then(console.log);
