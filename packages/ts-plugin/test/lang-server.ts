import { ChildProcess, fork } from 'child_process';
import { EventEmitter } from 'events';
import { server } from 'typescript/lib/tsserverlibrary';

/** All requests used in tests */
export type Requests = server.protocol.OpenRequest | server.protocol.SemanticDiagnosticsSyncRequest;

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

    this.server.stdout!.on('data', (data) => {
      const [_length, _eol, res] = data.split('\n', 3);
      const obj = JSON.parse(res);

      if (obj.type === 'event') {
        this.responseEventEmitter.emit(obj.event, obj);
      } else if (obj.type === 'response') {
        this.responseCommandEmitter.emit(obj.command, obj);
      }
    });
  }

  public send(command: Omit<Requests, 'seq' | 'type'>) {
    const seq = ++this.sequence;
    const req = JSON.stringify(Object.assign({ seq: seq, type: 'request' }, command)) + '\n';
    this.server.stdin!.write(req);
  }

  [Symbol.asyncDispose]() {
    if (!this.isClosed) {
      this.isClosed = true;
      this.server.stdin!.end();
    }

    return this.exitPromise;
  }

  waitEvent(eventName: string): Promise<any> {
    return new Promise((res) => this.responseEventEmitter.once(eventName, res));
  }

  waitResponse(commandName: string): Promise<any> {
    return new Promise((res) => this.responseCommandEmitter.once(commandName, res));
  }
}
