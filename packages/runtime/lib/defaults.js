const { buildLocalReference } = require('./json-schema');
const { defaultOpenApiInfo, scalarUiTheme } = require('./swagger');

const defaultOptions = {
  '@fastify/sensible': { sharedSchemaId: 'HttpError' },
  '@fastify/multipart': { attachFieldsToBody: true },
  '@fastify/swagger': {
    mode: 'dynamic',
    openapi: {
      openapi: '3.1.0',
      info: defaultOpenApiInfo
    },
    refResolver: {
      buildLocalReference
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

exports.defaultOptions = defaultOptions;
