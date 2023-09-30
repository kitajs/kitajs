import { Parameter, ParameterParser, Route } from '@kitajs/common';
import type ts from 'typescript';
import { KitaParser } from '../parser';
import { joinParameters } from '../util/syntax';

export class ProviderParameterParser implements ParameterParser {
  /** Providers MUST be agnostic */
  agnostic = true;

  constructor(readonly parser: KitaParser) {}

  supports(param: ts.ParameterDeclaration): boolean | Promise<boolean> {
    const name = param.type?.getFirstToken()?.getText();
    return !!(name && this.parser.providers.has(name));
  }

  async parse(
    param: ts.ParameterDeclaration,
    _route: Route,
    _node: ts.FunctionDeclaration,
    index: number
  ): Promise<Parameter> {
    const name = param.type!.getFirstToken()!.getText();
    const provider = this.parser.providers.get(name)!;

    const providerName = `Resolver${index}`;
    const value = `param${index}`;

    return {
      providerName,
      value,
      helper: /* ts */ `${joinParameters(provider.parameters)}
const ${value} = await ${providerName}(${provider.parameters.map((p) => p.value).join(',')});`,
      imports: [/* ts */ `import ${providerName} from "${provider.providerPath}";`]
    };
  }
}
