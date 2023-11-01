import { KitaConfig, KitaDevHook } from '@kitajs/common';
import { Command, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { ChildProcess } from 'child_process';
import chokidar from 'chokidar';
import closeWithGrace from 'close-with-grace';
import { spawn } from 'cross-spawn';
import debounce from 'debounce';
import EventEmitter from 'events';
import { deferred } from 'fast-defer';
import fs from 'fs';
import isRunning from 'is-running';
import { setTimeout } from 'timers/promises';
import { readConfig } from '../util/config';

type Stoppable<T, R = unknown> = T & { stopHook?: () => Promise<R> };

export default class Dev extends Command {
  static override description = 'Watches your source code and rebuilds the runtime on changes.';

  static override flags = {
    config: Flags.file({
      char: 'c',
      exists: true,
      description: 'Path to your kita.config.js file, if any.'
    }),
    root: Flags.string({
      char: 'r',
      description: 'Custom root directory for your project.'
    }),
    debug: Flags.boolean({
      description: 'Prints full resolved config to stdout.',
      default: false
    })
  };

  private kitaConfig: KitaConfig;
  private serverStarting = false;
  private serverProcess: Stoppable<ChildProcess> | undefined;

  async run(): Promise<void> {
    const { flags } = await this.parse(Dev);

    this.log(chalk.yellow`Thanks for using Kita! 🎉\n`);

    this.kitaConfig = await readConfig(flags.root ?? process.cwd(), this.error.bind(this), flags.config);

    if (flags.debug) {
      ux.styledJSON(this.kitaConfig);
      return this.exit(0);
    }

    // Increases max listeners to avoid warnings
    process.setMaxListeners(process.getMaxListeners() + this.kitaConfig.dev.hooks.length * 3 + 3);

    const hadPrevious = await this.closePreviousPid();

    if (hadPrevious) {
      this.log(chalk.gray`Closed previous PID`);
    }

    // Defines a debounced runner for each hook
    for (const hook of this.kitaConfig.dev.hooks) {
      hook.run = this.runHook.bind(this, hook);

      // Wraps in a debounced runner for the hook, if needed
      if (hook.debounce) {
        hook.run = debounce(hook.run, hook.debounce, true);
      }
    }

    let initHooksRan = 0;
    let watchHooksSetup = 0;

    for (const hook of this.kitaConfig.dev.hooks) {
      // Init hooks are normal hooks but need to be ran before the watcher starts
      if (hook.init) {
        this.log(chalk.gray`Running init hook ${hook.exec}...`);

        // Runs the hook\
        if (hook.async) {
          hook.run!().catch(this.logToStderr);
        } else {
          await hook.run!();
        }

        this.log(chalk.gray`Hook finished`);

        initHooksRan++;
      }

      if (hook.watch) {
        const watcher = chokidar.watch(hook.watch, {
          cwd: this.kitaConfig.cwd,
          persistent: true,
          ignoreInitial: true,
          ignored: hook.ignore
        });

        // Every time a file is changed, run the hook
        watcher.on('all', () => hook.run!().catch(this.logToStderr));

        // Closes the watcher on shutdown
        closeWithGrace(watcher.close.bind(watcher));

        watchHooksSetup++;
      }
    }

    this.log(chalk.gray`Ran ${initHooksRan} init hooks`);
    this.log(chalk.gray`Setup all ${watchHooksSetup} watcher hooks`);

    if (this.kitaConfig.dev.server !== false) {
      const runServer = debounce(this.runServerHook.bind(this), this.kitaConfig.dev.debounce);

      if (this.kitaConfig.dev.watch) {
        const watcher = chokidar.watch(this.kitaConfig.dev.watch, {
          cwd: this.kitaConfig.cwd,
          ignored: this.kitaConfig.dev.ignore,
          persistent: true,
          ignoreInitial: true
        });

        // Every time a file is changed, run the hook
        watcher.on('change', (path) => {
          // Only runs for .js files
          if (!path.endsWith('.js')) {
            return;
          }

          // runServer only returns a promise after the first execution
          return runServer(path)?.catch(this.logToStderr);
        });

        // Simple error logging
        watcher.on('error', this.logToStderr.bind(this));

        // Closes the watcher on shutdown
        closeWithGrace(watcher.close.bind(watcher));
      }

      // Runs the server for the first time
      await this.runServerHook();
    }
  }

  /** Closes previously opened server and starts a new one. */
  async runServerHook(changedPath?: string) {
    // Ignores if server is already starting
    if (this.serverStarting) {
      return;
    }

    // Marks the server as starting
    this.serverStarting = true;

    if (this.kitaConfig.dev.warn) {
      // Only logs here to help with debouncing
      if (changedPath) {
        this.log(chalk.grey`File ${changedPath} has been changed, restarting server...`);
      }

      this.log(chalk.grey`Starting development server...`);
    }

    if (this.serverProcess) {
      if (this.kitaConfig.dev.warn) {
        this.log(chalk.grey`Stopping server for restart...`);
      }

      // Closes the previous server with the createProcess close hook
      await this.serverProcess.stopHook?.();

      if (this.kitaConfig.dev.warn) {
        this.log(chalk.grey`Previous server stopped.`);
      }

      // Removes the PID file, if it exists
      if (fs.existsSync(this.kitaConfig.dev.pid)) {
        await fs.promises.unlink(this.kitaConfig.dev.pid);
      }

      delete this.serverProcess;
    }

    // Runs all post hooks before starting server
    for (const hook of this.kitaConfig.dev.hooks) {
      // Post hooks are normal hooks but need to be ran after the watcher function ends
      if (!hook.post) {
        continue;
      }

      this.log(chalk.gray`Running post hook ${hook.exec}...`);

      // Runs the hook

      if (hook.async) {
        hook.run!().catch(this.logToStderr);
      } else {
        await hook.run!();
      }

      this.log(chalk.gray`Hook finished`);
    }

    this.log(chalk.gray`All post hooks finished.`);

    // Creates a new server process
    this.serverProcess = await this.createServerProcess();

    // Writes current PID to file
    await fs.promises.writeFile(this.kitaConfig.dev.pid, this.serverProcess!.pid!.toString());

    // Marks the server as started
    this.serverStarting = false;
  }

  async createServerProcess() {
    const [cmd, ...args] = String(this.kitaConfig.dev.server).split(' ');
    const server = spawn(cmd!, args, {
      cwd: this.kitaConfig.cwd,
      env: process.env,
      stdio: 'inherit'
    });

    // Wait for the process to be successfully spawned
    await createOncePromise(server, 'spawn');

    // Creates a shutdown hook for this process
    createShutdownHook(server);

    // Clear previous console output
    if (this.kitaConfig.dev.clear) {
      if (this.kitaConfig.dev.clear !== 'screen') {
        this.log('\x1Bc');
      }

      console.clear();
    }

    // Ring the bell before restart
    if (this.kitaConfig.dev.bell) {
      this.log('\x07');
    }

    return server;
  }

  /** Closes the previous PID file, if it exists. */
  async closePreviousPid() {
    const exists = fs.existsSync(this.kitaConfig.dev.pid);

    // No previous file
    if (!exists) {
      return false;
    }

    // Reads PID value
    let pid: number | string = await fs.promises.readFile(this.kitaConfig.dev.pid, 'utf-8');
    pid = parseInt(pid, 10);

    // Could not parse PID or PID is not running
    if (!pid || !isRunning(pid)) {
      return false;
    }

    // Kills previous process
    await killPid(pid);
    await fs.promises.unlink(this.kitaConfig.dev.pid);

    return true;
  }

  async runHook(hook: KitaDevHook) {
    const [cmd, ...args] = hook.exec.split(' ');
    const hookProcess = await this.createProcess(cmd!, args);
    const code = await createOncePromise<number>(hookProcess, 'exit');

    if (code !== 0) {
      this.error(chalk.red`Hook '${hook.exec}' exited with code ${code}`);
    }

    this.log(chalk.gray`Hook '${hook.exec}' exited with code ${code}`);
  }

  /** Creates the TSC watcher child process and streams its output to the logger. */
  async createProcess(cmd: string, args: string[]) {
    const cp = spawn(cmd, args, {
      cwd: this.kitaConfig.cwd,
      env: process.env,
      stdio: 'inherit'
    }) as Stoppable<ChildProcess>;

    // Wait for the process to be successfully spawned
    await createOncePromise(cp, 'spawn');

    // Creates a shutdown hook for this process
    createShutdownHook(cp);

    return cp;
  }
}

/**
 * Creates a shutdown hook for the given child process. The returned hook as a `stop` function that can be used to stop
 * the process manually.
 */
function createShutdownHook(cp: Stoppable<ChildProcess>) {
  // The function responsible to correctly stop the child process
  // and close itself from the hook
  async function stopHook() {
    // Tries to remove current hook
    hook.uninstall();

    // In case the child process closed by itself, no need to infinitely wait
    // for something that won't exit twice.
    if (
      cp.exitCode ||
      cp.killed ||
      //@ts-expect-error - internal property
      closeWithGrace.closing
    ) {
      return Promise.resolve([]);
    }

    // Attaches a promise waiting for the process to exit
    const promise = createOncePromise(cp, 'exit');

    // Kills the child process
    await killPid(cp.pid!);

    // Returns the original promise of when the process exited
    return promise;
  }

  // Creates a shutdown hook for this process
  const hook = closeWithGrace(function shutdownHook() {
    // Removes the hook so it doesn't run again
    cp.removeListener('exit', hook.uninstall);

    // Calls the stop function
    return stopHook();
  }) as Stoppable<ReturnType<typeof closeWithGrace>>;

  // Removes the hook so it doesn't run again
  cp.once('exit', hook.uninstall);

  // Adds the stop function to the hook
  hook.stopHook = stopHook;
  // Also attaches the stop hook to the child process
  cp.stopHook = stopHook;

  return hook;
}

/** Kills a process and waits for it to close. */
async function killPid(pid: number) {
  // Kills previous process
  process.kill(pid);

  // Waits for the process to close
  do {
    // 50ms is a good compromise between CPU usage and reactivity
    await setTimeout(50);
  } while (isRunning(pid));
}

/** Creates a promise that is resolved once the given command is executed. */
function createOncePromise<T>(emitter: EventEmitter, event: string, errorEvent = 'error') {
  const def = deferred<T>();

  function eventListener(arg: T) {
    // Tries to remove the error listener so it doesn't leak
    if (errorEvent) {
      emitter.removeListener(errorEvent, errorListener);
    }

    // Resolves the deferred
    return def.resolve(arg);
  }

  function errorListener(arg: unknown) {
    // Tries to remove the event listener so it doesn't leak
    if (event) {
      emitter.removeListener(event, eventListener);
    }

    // Rejects the promise
    return def.reject(arg);
  }

  // Adds the listener listener
  if (event) {
    emitter.once(event, eventListener);
  }

  // Adds the error listener
  if (errorEvent) {
    emitter.once(errorEvent, errorListener);
  }

  return def;
}
