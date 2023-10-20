import { BodyInGetRequestError, KitaConfig, Parameter, ParameterParser, Route, kRequestParam } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import { mergeSchema } from '../schema/helpers';
import { getParameterName, getTypeNodeName, isParamOptional } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class FileParameterParser implements ParameterParser {
  agnostic = true;

  constructor(private config: KitaConfig) {}

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'File' || getTypeNodeName(param) === 'SavedFile';
  }

  parse(param: ts.ParameterDeclaration, route: Route): Parameter {
    if (route.method === 'GET') {
      throw new BodyInGetRequestError(param.type || param);
    }

    const name = getParameterName(param, 0);
    const isSavedFile = getTypeNodeName(param) === 'SavedFile';

    // Adds multipart/form-data to the consumes array
    route.schema.consumes = ['multipart/form-data'];

    const optional = isParamOptional(param);

    mergeSchema(route, {
      body: {
        type: 'object',
        properties: {
          // @ts-expect-error - isFile is a internal property of @fastify/multipart
          [name]: { isFile: true }
        },
        required: optional ? [] : [name],
        additionalProperties: this.config.generatorConfig.additionalProperties
      }
    });

    if (isSavedFile) {
      let helper;

      // No previous file parameters, we need to add the helper
      if (!route.parameters.find((f) => f.name === FileParameterParser.name)) {
        helper = `await ${kRequestParam}.saveRequestFiles()`;
      }

      return {
        name: FileParameterParser.name,
        value: `${kRequestParam}.savedRequestFiles.find(file => file.fieldname === '${name}')`,
        helper: helper
      };
    }

    return {
      name: FileParameterParser.name,
      value: buildAccessProperty(kRequestParam, 'body', name)
    };
  }
}
