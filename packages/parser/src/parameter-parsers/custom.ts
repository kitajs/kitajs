import { AstCollector, ParameterParser, Route } from '@kitajs/common';
import type ts from 'typescript';
import { format } from '../util/codegen';
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

    const providerName = `Resolver${index}`;
    const value = `param${index}`;

    return {
      providerName,
      value,
      helper: format(/* ts */ `

${joinParameters(provider.parameters)}
const ${value} = await ${providerName}(${provider.parameters.map((p) => p.value).join(',')});

`),
      imports: [
        format(/* ts */ `

import ${providerName} from "${provider.providerPath}";

`)
      ]
    };
  }
}
