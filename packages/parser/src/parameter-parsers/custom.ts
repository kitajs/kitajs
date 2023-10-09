import { AstCollector, ParameterParser, Route } from '@kitajs/common';
import type ts from 'typescript';
import { getTypeNodeName } from '../util/nodes';
import { joinParameters } from '../util/syntax';

export class ProviderParameterParser implements ParameterParser {
  agnostic = true;

  constructor(private collector: AstCollector) {}

  supports(param: ts.ParameterDeclaration) {
    const name = getTypeNodeName(param);
    return !!name && !!this.collector.getProvider(name);
  }

  parse(param: ts.ParameterDeclaration, _route: Route, _node: ts.FunctionDeclaration, index: number) {
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

    return {
      value,
      imports: [{ name: importName, path: provider.providerPath }],
      schemaTransformer: provider.schemaTransformer,
      providerName: originalProviderName,
      helper: /* ts */ `

${joinParameters(provider.parameters)}
const ${value} =${provider.async ? ' await ' : ' '}${providerName}(${provider.parameters
        .map((p) => p.value)
        .join(',')});

`.trim()
    };
  }
}
