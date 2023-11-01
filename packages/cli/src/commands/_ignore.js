const childProcess = require('child_process');
const chokidar = require('chokidar');
const fs = require('fs');
const fsPromises = require('fs/promises');
const onShutdown = require('close-with-grace');
const debounce = require('debounce');
const path = require('path');
const { deferred } = require('fast-defer');
const isRunning = require('is-running');
const { setTimeout } = require('timers/promises');

const DEFAULTS = {
  dist: './dist',

  server: './dist/index.js',
  nodeArgs: ['--inspect=7000'],
  serverDebounce: 2000,
  serverAutoWatch: true,
  // If we should not pipe the server output to the console
  serverSilent: false,
  // If we should print the Starting server... message
  serverWarn: true,

  project: './tsconfig.build.json',
  pid: './dist/server.pid',

  bell: true,
  clear: 'keep',

  cwd: process.cwd(),

  hooks: [
    {
      watch: './src/routes/**/*',
      ignore: undefined,
      exec: 'pnpm kita build',
      init: true,
      debounce: 1000,
      cwd: process.cwd()
    },
    {
      post: true,
      exec: 'pnpm tsc-alias',
      cwd: process.cwd()
    },
    {
      watch: './swagger.json',
      debounce: 1000,
      ignore: undefined,
      exec: 'pnpm --filter @fdm/frontend orval',
      cwd: process.cwd()
    },
    {
      watch: './swagger.json',
      debounce: 1000,
      ignore: undefined,
      exec: 'pnpm --filter @fdm/link orval',
      cwd: process.cwd()
    }
  ]
};

/** Adds .cmd when process is in windows */
function formatBin(cmd) {
  return /^win/.test(process.platform) ? `${cmd}.cmd` : cmd;
}

async function watch(options = DEFAULTS) {
  // Increases max listeners to avoid warnings
  process.setMaxListeners(options.hooks.length * 3 + 3);

  const hadPrevious = await closePreviousPid(options);
  hadPrevious && logger.write(`Closed previous PID\n`);

  // Defines a debounced runner for each hook
  for (const hook of options.hooks) {
    hook.run = runHook.bind(null, hook, options, logger);

    // Wraps in a debounced runner for the hook, if needed
    if (hook.debounce) {
      hook.run = debounce(hook.run, hook.debounce, true);
    }
  }

  const initHooksCount = await runInitHooks(options, logger);
  logger.write(`Ran all ${initHooksCount} init hooks\n`);

  const watcherHooksCount = setupWatchHooks(options, logger);
  logger.write(`Setup all ${watcherHooksCount} watcher hooks\n`);

  // Tsc process does not needs any extra handling
  await createProcess('tsc', ['-w', '--preserveWatchOutput', '-p', options.project], options, logger);
  logger.write('Tsc watcher is running');

  // The debounced server runner
  const runServer = debounce(runServerHook, options.serverDebounce);

  if (options.serverAutoWatch) {
    const watcher = chokidar.watch(options.dist, {
      cwd: options.cwd,
      ignored: options.ignore,
      persistent: true,
      ignoreInitial: true
    });

    // Every time a file is changed, run the hook
    watcher.on('change', function changeWatcher(path) {
      // Only runs for .js files
      if (!path.endsWith('.js')) {
        return;
      }

      // runServer only returns a promise after the first execution
      return runServer(options, logger, path)?.catch(logger.writeStr);
    });

    // Simple error logging
    watcher.on('error', logger.writeStr);

    // Closes the watcher on shutdown
    onShutdown(watcher.close.bind(watcher));
  }

  // Runs the server hook for the first time
  await runServerHook(options, logger);
}

async function killPid(pid) {
  // Kills previous process
  process.kill(pid);

  // Waits for the process to close
  do {
    // 50ms is a good compromise between CPU usage and reactivity
    await setTimeout(50);
  } while (isRunning(pid));
}

async function closePreviousPid(options) {
  const exists = fs.existsSync(options.pid);

  // No previous file
  if (!exists) {
    return false;
  }

  // Reads PID value
  let pid = await fsPromises.readFile(options.pid, 'utf-8');
  pid = parseInt(pid, 10);

  // Could not parse PID or PID is not running
  if (!pid || !isRunning(pid)) {
    return false;
  }

  killPid(pid);

  // Removes the PID file
  await fsPromises.unlink(options.pid);

  return true;
}

/** Closes previously opened server and starts a new one. */
async function runServerHook(options, logger, changedPath) {
  // Ignores if server is already starting
  if (options.serverStarting) {
    return;
  }

  // Marks the server as starting
  options.serverStarting = true;

  if (options.serverWarn) {
    // Only logs here to help with debouncing
    if (changedPath) {
      console.log(`File ${changedPath} has been changed, restarting server...`);
    }

    console.log('Starting development server...');
  }

  if (options.serverProcess) {
    logger.write('Stopping server for restart...\n');

    // Closes the previous server with the createProcess close hook
    await options.serverProcess.stopHook();

    logger.write('Previous server stopped.\n');

    // Removes the PID file, if it exists
    if (fs.existsSync(options.pid)) {
      await fsPromises.unlink(options.pid);
    }

    delete options.serverProcess;
  }

  // Runs all post hooks before starting server
  await runPostHooks(options, logger);

  logger.write('Starting server...\n');

  // Creates a new server process
  options.serverProcess = await createServerProcess(options);

  // Writes current PID to file
  await fsPromises.writeFile(options.pid, options.serverProcess.pid.toString());

  // Marks the server as started
  options.serverStarting = false;
}

/** Runs all pre-hooks. */
async function runInitHooks(options, logger) {
  return amount;
}

/** Runs all post-hooks. */
async function runPostHooks(options, logger) {
  let amount = 0;

  for (const hook of options.hooks) {
    // Post hooks are normal hooks but need to be ran after the watcher function ends
    if (!hook.post) {
      continue;
    }

    logger.write(`Running post hook ${hook.exec}...\n`);

    // Runs the hook
    try {
      await hook.run();
    } catch (err) {
      logger.writeStr(error);
    }

    logger.write(`Hook finished\n`);

    amount++;
  }

  return amount;
}

/** Runs a hook that need to be ran before the tsc watcher starts. */
function setupWatchHooks(options, logger) {
  let amount = 0;

  for (const hook of options.hooks) {
    // Init hooks are normal hooks but need to be ran before the watcher starts
    if (!hook.watch) {
      continue;
    }

    const watcher = chokidar.watch(hook.watch, {
      cwd: options.cwd,
      persistent: true,
      ignoreInitial: true,
      ignored: hook.ignore
    });

    // Every time a file is changed, run the hook
    watcher.on('all', function hookWatcher() {
      return hook.run().catch(logger.writeStr);
    });

    // Closes the watcher on shutdown
    onShutdown(watcher.close.bind(watcher));

    amount++;
  }

  return amount;
}

/** Simply run a hook. Execution order or triggering is not handled here. */
async function runHook(hook, options, logger) {
  const [cmd, ...args] = hook.exec.split(' ');
  const hookProcess = await createProcess(cmd, args, options, logger, hook.cwd);
  const code = await createOncePromise(hookProcess, 'exit');

  if (code !== 0) {
    const logs = await fs.promises.readFile(options.log, 'utf-8');
    throw new Error(`Hook '${hook.exec}' exited with code ${code}:\n${logs}`);
  }

  logger.write(`Hook '${hook.exec}' exited successfully\n`);
}

/** Creates a auto closing logger write stream */
async function createLogger(options) {
  const logger = fs.createWriteStream(options.log, {
    // changes between write and append mode
    flags: options.cleanLog ? 'w' : 'a'
  });

  // Wait for the logger to be ready
  await createOncePromise(logger, 'open');

  // This shutdown hook is easier because we just need
  // to close the logger
  const hook = onShutdown(function loggerShutdown(_, cb) {
    // Removes the hook so it doesn't run again
    logger.removeListener('close', hook.uninstall);
    // Closes the logger
    logger.end(cb);
  });

  // Removes the hook so it doesn't run again
  logger.once('close', hook.uninstall);

  // A simple function that writes a casted string to the logger
  logger.writeStr = function writeStr(error) {
    logger.write(String(error) + '\n');
  };

  return logger;
}

/** Creates server process */
async function createServerProcess(options) {
  const server = childProcess.spawn('node', options.nodeArgs.concat(options.server), {
    cwd: options.cwd,
    env: process.env,
    stdio: options.serverSilent ? 'ignore' : [process.stdin, process.stdout, process.stderr]
  });

  // Wait for the process to be successfully spawned
  await createOncePromise(server, 'spawn');

  // Creates a shutdown hook for this process
  createShutdownHook(server);

  // Clear previous console output
  if (options.clear) {
    if (options.clear !== 'keep') {
      process.stdout.write('\x1Bc');
    }

    console.clear();
  }

  // Ring the bell before restart
  if (options.bell) {
    console.log('\x07');
  }

  return server;
}

/**
 * Creates a promise that is resolved once the given command is executed.
 *
 * @param {string} event
 * @param {string} [errorEvent='error'] Default is `'error'`
 * @returns {Promise}
 */
function createOncePromise(emitter, event, errorEvent) {
  // User may want to explicitly ignore errors
  errorEvent ??= 'error';

  const def = deferred();

  function eventListener() {
    // Tries to remove the error listener so it doesn't leak
    if (errorEvent) {
      emitter.removeListener(errorEvent, errorListener);
    }

    // Resolves the deferred
    return def.resolve.apply(null, arguments);
  }

  function errorListener() {
    // Tries to remove the event listener so it doesn't leak
    if (event) {
      emitter.removeListener(event, eventListener);
    }

    // Rejects the promise
    return def.reject.apply(null, arguments);
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

watch().catch(console.error);
