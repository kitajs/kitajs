import { KitaParser, ParameterParser, Route } from '@kitajs/common';
import type ts from 'typescript';
import { format } from '../util/codegen';
import { getTypeNodeName } from '../util/nodes';
import { joinParameters } from '../util/syntax';

export class ProviderParameterParser implements ParameterParser {
  /** Providers MUST be agnostic */
  agnostic = true;

  constructor(private parser: KitaParser) {}

  supports(param: ts.ParameterDeclaration) {
    const name = getTypeNodeName(param);
    return !!name && !!this.parser.getProvider(name);
  }

  parse(param: ts.ParameterDeclaration, _route: Route, _node: ts.FunctionDeclaration, index: number) {
    const name = getTypeNodeName(param)!;
    const provider = this.parser.getProvider(name)!;

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
