import {
  InvalidProviderGenericTypeError,
  type AstCollector,
  type Parameter,
  type ParameterParser,
  type Route
} from '@kitajs/common';
import { ts } from 'ts-json-schema-generator';
import { getParameterGenerics, getTypeNodeName } from '../util/nodes';
import { joinParameters } from '../util/syntax';
import { ProviderGenericsParameterParser } from './provider-generics';

export class ProviderParameterParser implements ParameterParser {
  constructor(private collector: AstCollector) {}

  supports(param: ts.ParameterDeclaration) {
    const name = getTypeNodeName(param);
    return !!name && !!this.collector.getProvider(name);
  }

  async parse(
    param: ts.ParameterDeclaration,
    route: Route,
    _node: ts.FunctionDeclaration,
    index: number
  ): Promise<Parameter> {
    const name = getTypeNodeName(param)!;
    const provider = this.collector.getProvider(name)!;

    const parameters = await provider.parseParameters(route, param);

    const providerGenericsIndex = parameters.findIndex((p) => p.name === ProviderGenericsParameterParser.name);

    // Changes the default [] to the generics passed to the Provider
    if (providerGenericsIndex !== -1) {
      const generics = getParameterGenerics(param);
      const arr = [];

      for (const generic of generics) {
        // 01, 'str', true
        if (!ts.isLiteralTypeNode(generic)) {
          throw new InvalidProviderGenericTypeError(generic);
        }

        arr.push(generic.literal.getText());
      }

      parameters[providerGenericsIndex]!.value = `[${arr.join(', ')}]`;
    }

    const value = `param${index + parameters.length}`;

    return {
      name: ProviderParameterParser.name,

      value,

      providerName: provider.type,

      imports: [{ name: provider.type, path: provider.providerPath }].concat(
        parameters.flatMap((p) => p.imports || [])
      ),

      schemaTransformer:
        provider.schemaTransformer &&
        (providerGenericsIndex !== -1 ? [parameters[providerGenericsIndex]!.value] : provider.schemaTransformer),

      helper: `${joinParameters(parameters)}
const ${value} = ${provider.async ? 'await ' : ''}${provider.type}.default(${parameters
        .map((p) => p.value)
        .join(',')});`.trim()
    };
  }
}
