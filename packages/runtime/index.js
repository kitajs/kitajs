const fp = require('fastify-plugin');

// The Kita plugin only registers all routes, plugins and schemas exported by your runtime
module.exports.Kita = fp(
  /**
   * @param {import('./types/runtime.d.ts').KitaPluginOptions<
   *   import('./types/runtime.d.ts').KitaGeneratedRuntime<Record<string, any>>
   * >} opts
   */
  async (fastify, opts) => {
    const { runtime } = await opts.runtime;

    // Adds all plugins
    for (const pluginName in runtime.plugins) {
      const plugin = runtime.plugins[pluginName][0];
      const defaultOptions = runtime.plugins[pluginName][1];
      const display = plugin[Symbol.for('fastify.display-name')];

      if (display && !fastify.hasPlugin(display) && opts.plugins[pluginName] !== false) {
        await fastify.register(plugin, {
          ...defaultOptions,
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
