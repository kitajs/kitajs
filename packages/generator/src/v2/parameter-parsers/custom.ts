import type ts from 'typescript';
import type { KitaConfig } from '../../config';
import { Kita } from '../kita';
import type { BaseParameter, BaseRoute } from '../models';
import { CustomParameter } from '../parameters/custom';
import type { ParameterParser } from '../parsers';
import type { SchemaBuilder } from '../schema/builder';
import { getParameterGenerics } from '../util/nodes';

export class CustomParameterParser implements ParameterParser {
  constructor(
    readonly config: KitaConfig,
    readonly kita: Kita,
    readonly schema: SchemaBuilder,
    readonly program: ts.Program
  ) {}

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
