import type { Parameter, ParameterParser } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import { getTypeNodeName } from '../util/nodes';

export class ProviderGenericsParameterParser implements ParameterParser {
  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'ProviderGenerics';
  }

  /** Defaults to an empty array, because the `ProviderParameterParser` will override this value for each parameter. */
  parse(): Parameter {
    return {
      name: ProviderGenericsParameterParser.name,
      value: '[]'
    };
  }
}
