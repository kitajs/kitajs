import { type ChildProcess, fork } from 'node:child_process';
import { EventEmitter } from 'node:events';
import type { server } from 'typescript/lib/tsserverlibrary';

/** All requests used in tests */
export type Requests =
  | server.protocol.OpenRequest
  | server.protocol.SemanticDiagnosticsSyncRequest
  | server.protocol.CompletionsRequest;

const CONTENT_LENGTH_HEADER = 'Content-Length: ';

export class TSLangServer {
  responseEventEmitter = new EventEmitter();
  responseCommandEmitter = new EventEmitter();
  exitPromise: Promise<void>;
  isClosed = false;
  server: ChildProcess;
  sequence = 0;

  constructor(projectPath: string) {
    this.server = fork(require.resolve('typescript/lib/tsserver'), {
      cwd: projectPath,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    this.exitPromise = new Promise((resolve, reject) => {
      this.server.on('exit', resolve);
      this.server.on('error', reject);
    });

    this.server.stdout!.setEncoding('utf-8');

    let expLength = 0;
    let buffered = '';

    this.server.stdout!.on('data', (data) => {
      // Start of a new data packet
      if (data.startsWith(CONTENT_LENGTH_HEADER)) {
        // Content-Length: 123\n\n{...}
        const [length, , res] = data.split('\n', 3);

        expLength = Number.parseInt(length.slice(CONTENT_LENGTH_HEADER.length), 10);
        buffered = res;

        // Continuation of a previous packet
      } else {
        buffered += data;
      }

      // More data is expected, so we need to wait for the next chunk
      if (expLength - 1 > buffered.length) {
        return;
      }

      const obj = JSON.parse(buffered);

      if (obj.type === 'event') {
        this.responseEventEmitter.emit(obj.event, obj);
      } else if (obj.type === 'response') {
        this.responseCommandEmitter.emit(obj.command, obj);
      }
    });
  }

  public send(command: Omit<Requests, 'seq' | 'type'>) {
    this.server.stdin!.write(`${JSON.stringify(Object.assign({ seq: ++this.sequence, type: 'request' }, command))}\n`);
  }

  [Symbol.asyncDispose]() {
    if (!this.isClosed) {
      this.isClosed = true;
      this.server.stdin!.end();
    }

    return this.exitPromise;
  }

  waitEvent(eventName: string) {
    return new Promise((res) => this.responseEventEmitter.once(eventName, res));
  }

  waitResponse(commandName: string) {
    return new Promise((res) => this.responseCommandEmitter.once(commandName, res));
  }
}
