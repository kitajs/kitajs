import type ts from 'typescript';
import { Kita } from '../kita';
import type { BaseParameter, BaseRoute } from '../models';
import { CustomParameter } from '../parameters/custom';
import type { ParameterParser } from '../parsers';
import { getParameterGenerics } from '../util/nodes';

export class ProviderParameterParser implements ParameterParser {
  /** Providers MUST be agnostic */
  agnostic = true;

  constructor(readonly kita: Kita) {}

  supports(param: ts.ParameterDeclaration): boolean | Promise<boolean> {
    const name = param.type?.getFirstToken()?.getText();
    return !!(name && this.kita.providers.has(name));
  }

  async parse(
    param: ts.ParameterDeclaration,
    _route: BaseRoute,
    _node: ts.FunctionDeclaration,
    index: number
  ): Promise<BaseParameter> {
    const name = param.type!.getFirstToken()!.getText();
    const provider = this.kita.providers.get(name)!;

    return new CustomParameter(
      index,
      provider,
      getParameterGenerics(param).map((p) => p.getText()),
      provider.schemaTransformer
    );
  }
}
