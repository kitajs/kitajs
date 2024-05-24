const fp = require('fastify-plugin');
const { defaultOptions } = require('./defaults.js');

// The Kita plugin only registers all routes, plugins and schemas exported by your runtime
const Kita = fp(
  /** @param {import('../types/plugin').KitaPluginOptions} opts */
  async function fastifyKita(fastify, opts) {
    opts.plugins = opts.plugins || {};

    let runtime = await opts.runtime;

    if (!('__kita' in runtime)) {
      runtime = runtime.runtime;
    }

    // Adds all plugins
    for (const pluginName in runtime.plugins) {
      const plugin = require(runtime.plugins[pluginName]);
      const displayName = plugin[Symbol.for('fastify.display-name')];

      if (displayName && !fastify.hasPlugin(displayName) && opts.plugins[pluginName] !== false) {
        await fastify.register(plugin, {
          ...defaultOptions[pluginName],
          ...opts.plugins[pluginName]
        });
      }
    }

    // Adds all schemas
    for (const schema of runtime.schemas) {
      fastify.addSchema(schema);
    }

    // Register all routes inside a plugin to make sure capsulation works (mainly prefix option if defined)
    // https://github.com/fastify/fastify-plugin/issues/78#issuecomment-672692334
    await fastify.register(async (fastify) => {
      // Adds all application hooks
      for (const [name, handler] of runtime.applicationHooks) {
        fastify.addHook(name, handler);
      }

      // Adds all routes
      for (const route of runtime.routes) {
        fastify.route(route);
      }
    }, opts);
  },
  {
    name: '@kitajs/runtime',
    fastify: '4.x'
  }
);

exports.Kita = Kita;
