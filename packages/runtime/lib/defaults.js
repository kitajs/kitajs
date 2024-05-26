const { defaultOpenApiInfo, scalarUiTheme } = require('./swagger');

const defaultOptions = {
  fastifySensible: { sharedSchemaId: 'HttpError' },
  fastifyMultipart: { attachFieldsToBody: true },
  fastifySwagger: {
    mode: 'dynamic',
    openapi: {
      openapi: '3.1.0',
      info: defaultOpenApiInfo
    },
    refResolver: {
      buildLocalReference(json, _, __, i) {
        return String(json.$id || json.$title || json.name || json.title || `def-${i}`);
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

exports.defaultOptions = defaultOptions;
