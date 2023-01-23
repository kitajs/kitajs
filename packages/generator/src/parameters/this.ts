import deepmerge from 'deepmerge';
import { ts } from 'ts-json-schema-generator';
import type { TypeQueryNode } from 'typescript';
import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
import { prepareTypeAsObject, unquote } from '../util/string';
import { ParamData, ParamInfo, ParamResolver } from './base';

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

      if (options.getText().includes('keyof')) {
        throw KitaError(
          `A Route "this" options type cannot use the "keyof" keyword.`,
          route.controllerPath
        );
      }

      let rootProperties: string[] = [];

      for (const member of (options as ts.TypeLiteralNode).members) {
        const name = member.name?.getText();

        // Merges the schema property into the route schema
        if (name === 'schema') {
          const schemaText = prepareTypeAsObject(
            (member as ts.PropertySignature).type!.getText()
          );

          // Uses eval to transform the typescript type into a javascript object
          try {
            let schema = {};
            eval(`schema = ${schemaText}`);
            route.schema = deepmerge(route.schema, schema);
          } catch (error) {
            throw KitaError(
              `A Route "this" schema type cannot be evaluated.`,
              route.controllerPath,
              { schema: schemaText, error }
            );
          }

          continue;
        }

        rootProperties.push(
          prepareTypeAsObject(member.getText(), {
            controllerName: route.controllerName,
            controllerPath: route.controllerPath,
            preparePath: kita.importablePath.bind(kita)
          })
        );
      }

      // Prevent empty string options parameter
      if (rootProperties.length) {
        route.options = rootProperties.join(', ');
      }
    }

    return undefined;
  }
}
