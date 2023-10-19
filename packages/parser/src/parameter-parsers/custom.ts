import { AstCollector, InvalidProviderGenericType, Parameter, ParameterParser, Route } from '@kitajs/common';
import { ts } from 'ts-json-schema-generator';
import { getParameterGenerics, getTypeNodeName } from '../util/nodes';
import { joinParameters } from '../util/syntax';
import { ProviderGenericsParameterParser } from './provider-generics';

export class ProviderParameterParser implements ParameterParser {
  agnostic = true;

  constructor(private collector: AstCollector) {}

  supports(param: ts.ParameterDeclaration) {
    const name = getTypeNodeName(param);
    return !!name && !!this.collector.getProvider(name);
  }

  parse(param: ts.ParameterDeclaration, _route: Route, _node: ts.FunctionDeclaration, index: number): Parameter {
    const name = getTypeNodeName(param)!;
    const provider = this.collector.getProvider(name)!;

    const originalProviderName = `Resolver${index}`;
    let providerName = originalProviderName;
    let importName = providerName;

    if (provider.schemaTransformer) {
      importName = `* as ${providerName}`;
      providerName = `${providerName}.default`;
    }

    const value = `param${index}`;

    const providerGenericsIndex = provider.parameters.findIndex((p) => p.name === ProviderGenericsParameterParser.name);

    let providerGenerics = '';

    // Changes the default [] to the generics passed to the Provider
    if (providerGenericsIndex !== -1) {
      const generics = getParameterGenerics(param);
      const arr = [];

      for (const generic of generics) {
        // 01, 'str', true
        if (!ts.isLiteralTypeNode(generic)) {
          throw new InvalidProviderGenericType(generic);
        }

        arr.push(generic.literal.getText());
      }

      provider.parameters[providerGenericsIndex]!.value = `[${arr.join(', ')}]`;
    }

    return {
      name: ProviderParameterParser.name,
      value,
      imports: [{ name: importName, path: provider.providerPath }],
      schemaTransformer:
        provider.schemaTransformer &&
        (providerGenericsIndex !== -1
          ? [provider.parameters[providerGenericsIndex]!.value]
          : provider.schemaTransformer),
      providerName: originalProviderName,
      helper: /* ts */ `${joinParameters(provider.parameters)}
const ${value} = ${provider.async ? 'await ' : ''}${providerName}(${provider.parameters
        .map((p) => p.value)
        .join(',')});`.trim()
    };
  }
}
