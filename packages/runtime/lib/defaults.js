const { defaultOpenApiInfo, scalarUiTheme } = require('./swagger');

exports.defaultOptions = {
  '@fastify/sensible': { sharedSchemaId: 'HttpError' },
  '@fastify/multipart': { attachFieldsToBody: true },
  '@fastify/swagger': {
    mode: 'dynamic',
    openapi: {
      openapi: '3.1.0',
      info: defaultOpenApiInfo
    },
    refResolver: {
      // Custom resolves that prefers a meaningful title over a random id
      buildLocalReference(json, _, __, i) {
        return String(json.$id || json.$title || json.name || `def-${i}`);
      }
    }
  },
  fastifyScalarUi: {
    routePrefix: '/reference',
    configuration: {
      theme: 'none',
      customCss: scalarUiTheme
    }
  }
};
