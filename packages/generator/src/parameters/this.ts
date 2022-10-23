import { ts } from 'ts-json-schema-generator';
import type { TypeQueryNode } from 'typescript';
import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
import { unquote } from '../util/string';
import { ParamData, ParamInfo, ParamResolver } from './base';
import path from 'path';

export class ThisResolver extends ParamResolver {
  // This parameter is serializable because it does not generates any ast real world parameter.
  static override serializable = true;

  override supports({ paramName }: ParamInfo): boolean {
    return paramName === 'this';
  }

  override async resolve({
    generics,
    route,
    kita
  }: ParamData): Promise<Parameter | undefined> {
    if (!generics || generics.length < 1) {
      throw KitaError(`Missing generics for the "this" parameter.`, route.controllerPath);
    }

    //@ts-ignore typings come with @fastify/swagger
    route.operationId = route.schema.operationId = unquote(generics[0]!.getText());

    const options = generics[1];

    if (options) {
      // Complete external config, useful for more complex types
      if (options.kind === ts.SyntaxKind.TypeQuery) {
        route.options = `...${route.controllerName}.${(
          options as TypeQueryNode
        ).exprName.getText()}`;

        return;
      }

      if (options.kind !== ts.SyntaxKind.TypeLiteral) {
        throw KitaError(
          `A Route "this" type cannot have a reference to another type.`,
          route.controllerPath
        );
      }

      let text = options.getText();

      if (text.includes('keyof')) {
        throw KitaError(
          `A Route "this" options type cannot use the "keyof" keyword.`,
          route.controllerPath
        );
      }

      //
      // A lot of regexes to transform a valid typescript type into a evaluable javascript object.
      //

      // Removes the first { and last } of the string
      text = text.replace(/^\s*{|}\s*$/g, '');
      // Removes "border" spaces
      text = text.trim();
      // Replaces `typeof import('...')` with require('...')
      text = text.replace(/typeof import\(['"](.*?)['"]\)/g, (_, importPath) => {
        return `require('${kita.importablePath(
          // dirname supports paths with line numbers (e.g. /path/to/file.ts:1:2 -> /path/to)
          path.resolve(path.dirname(route.controllerPath), importPath) 
        )}')`;
      });
      // Replaces `typeof localMethod` to `ControllerName.localMethod`
      text = text.replace(/typeof (\w+);?/g, `${route.controllerName}.$1`);
      // Typescript types allows ; to be used as separators. This regex does not matches escaped ; (\;)
      text = text.replace(/(?<!\\);/g, ',');
      // Includes commas on line breaks, if not present
      text = text.replace(/(?<![,;{}]\s*)\n/g, ',');

      route.options ??= '';
      route.options += text;
    }

    return undefined;
  }
}
