import { fork, type ForkOptions } from 'node:child_process';
import path from 'node:path';

export const KITA_BIN = path.resolve(__dirname, '..', 'bin', 'dev.js');

export interface ForkResult {
  stdout: string;
  stderr: string;
}

export async function forkAsync(args: string[], options: ForkOptions): Promise<ForkResult> {
  return new Promise<ForkResult>((resolve, reject) => {
    const child = fork(KITA_BIN, args, options);

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        console.debug({ stdout, stderr });
        reject(new Error(`Child process exited with code ${code} and signal ${signal}`));
      }
    });
  });
}
