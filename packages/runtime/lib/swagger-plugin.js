const fp = require('fastify-plugin');
const path = require('node:path');
const fs = require('node:fs');

const KitaSwagger = fp(
  async (app, options) => {
    options.expose ??= '/openapi.json';
    options.file ??= path.resolve('openapi.json');
    options.pretty ??= true;
    options.when ??= true;

    // probably not in development mode
    if (!options.when) {
      app.log.debug({ name: 'kita' }, 'Swagger plugin disabled');
      return;
    }

    if (!app.hasPlugin('@fastify/swagger')) {
      app.log.warn({ name: 'kita' }, 'Swagger plugin not found, skipping integration.');
      return;
    }

    if (options.file) {
      app.addHook('onListen', async () => {
        await fs.promises.writeFile(
          options.file,
          options.pretty ? JSON.stringify(app.swagger(), null, 2) : JSON.stringify(app.swagger())
        );

        app.log.debug({ name: 'kita' }, 'OpenAPI file created');
      });
    }

    if (options.expose) {
      app.get(
        options.expose,
        // Hide route from Swagger UI
        { schema: { hide: true } },
        async () => app.swagger()
      );
    }
  },
  {
    name: '@kitajs/runtime/swagger',
    fastify: '4.x'
  }
);

exports.KitaSwagger = KitaSwagger;
