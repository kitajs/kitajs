import deepmerge from 'deepmerge';
import ts from 'typescript';
import type { KitaGenerator } from './generator';
import type { GeneratorResult, Route } from './generator-data';
import { filterRoute } from './util/route-name';
import { unquote } from './util/unquote';

/** True if this is visible outside this file, false otherwise */
function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !==
      0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}

export async function visitNode(
  node: ts.Node,
  source: ts.SourceFile,
  { kitaConfig, importablePath, schemaStorage }: KitaGenerator,
  result: GeneratorResult
): Promise<void> {
  const { controllerName, routePath } = filterRoute(source.fileName, kitaConfig);

  // Node is not a exported function.
  // TODO: Make it work with `export const get = () => {};`
  if (!isNodeExported(node) || node.kind !== ts.SyntaxKind.FunctionDeclaration) {
    return;
  }

  const fn = node as ts.FunctionDeclaration;
  const name = fn.name!.getText(source).toLowerCase();

  if (!['get', 'post', 'put', 'delete', 'head', 'options', 'all'].includes(name)) {
    return;
  }

  const route: Route = {
    method: fn.name!.getText(source).toLowerCase(),
    controllerName,
    path: routePath,
    schema: {},
    parameters: [],
    options: ''
  };

  for (let index = 0; index < fn.parameters.length; index++) {
    const parameter = fn.parameters[index]!;

    const name = parameter.name!.getText(source).trim();

    if (name === 'this') {
      const type = parameter.type! as ts.NodeWithTypeArguments;

      //@ts-ignore typings come with @fastify/swagger
      route.schema.operationId = unquote(type.typeArguments![0]!.getText());

      const options = type.typeArguments![1]!;

      if (options) {
        if (options.kind !== ts.SyntaxKind.TypeLiteral) {
          throw new Error(
            'You cannot reference another types in the Route type. For now, you will have to write it yourself.'
          );
        }

        route.options = options
          .getText()
          // Include quotes on line breaks
          .replace(/(?<!,)\s*\\n/g, ',')
          // Removes typeof to imports
          .replace(/typeof (\w+),?/g, `${controllerName}.$1`)
          // Typescript types allows ; to be used as separators. This regex does not matches escaped ; (\;)
          .replace(/(?<!\\);/g, ',')
          // Removes the first { and last } of the string
          .replace(/^\s*{|}\s*$/g, '')
          .trim()
          // Includes commas on line breaks, if not present
          .replace(/(?<![,;])\n/g, ',');
      }

      continue;
    }

    // Ignore generics
    const typename = parameter.type?.getFirstToken(source)?.getText(source);
    const generics = (parameter.type as ts.NodeWithTypeArguments).typeArguments || [];
    const optional = parameter.questionToken !== undefined;

    switch (typename) {
      case 'Path':
        const generic = generics[0]?.getText(source);
        const pathName = generic ? unquote(generic) : parameter.name.getText(source);

        route.parameters.push({
          value: `(request.params as { ${pathName}${
            optional ? '?' : ''
          }: string })['${pathName}']`
        });

        route.schema = deepmerge(route.schema, {
          params: {
            type: 'object',
            properties: { [pathName]: { type: 'string' } },
            required: optional ? [] : [pathName]
          }
        });

        break;

      case 'Cookie':
        // Include fastify cookie definitions
        result.addImport('addons', `import '@fastify/cookie';`);

        const paramName = parameter.name.getText(source);

        route.parameters.push({
          value: `request.cookies?.${paramName}`
        });

        break;

      case 'Body':
        // TODO: Better error message
        if (route.method === 'get') {
          throw new Error(
            `The HTTP specification does not allow the use of Body in GET requests.`
          );
        }

        // @ts-expect-error - any type is allowed
        if (route.schema.body?.properties) {
          throw new Error(`You cannot have Body and BodyProp in the same route.`);
        }

        const bodyType = generics[0];

        if (!bodyType) {
          throw new Error('Body must have a property type');
        }

        route.parameters.push({ value: `request.body as ${bodyType.getText(source)}` });

        route.schema = deepmerge(route.schema, {
          body: await schemaStorage.consumeNode(bodyType)
        });

        break;

      case 'BodyProp':
        // TODO: Better error message
        if (route.method === 'get') {
          throw new Error(
            `The HTTP specification does not allow the use of Body in GET requests.`
          );
        }

        // @ts-expect-error - any type is allowed
        if (route.schema.body?.$ref) {
          throw new Error(`You cannot have Body and BodyProp in the same route.`);
        }

        const propType = generics[0];

        if (!propType) {
          throw new Error('BodyProp must have a property type');
        }

        const propNameGeneric = generics[1]?.getText(source);
        const propName = propNameGeneric
          ? unquote(propNameGeneric)
          : parameter.name.getText(source);

        route.parameters.push({
          value: `(request.body as { ${propName}${
            optional ? '?' : ''
          }: ${propType.getText(source)} }).${propName}`
        });

        route.schema = deepmerge(route.schema, {
          body: {
            type: 'object',
            properties: { [propName]: await schemaStorage.consumeNode(propType) },
            required: optional ? [] : [propName]
          }
        });

        break;

      case 'Query':
        const queryType = generics[0];

        const quotedQueryName = queryType
          ? queryType.getFullText(source)
          : parameter.name.getText(source);

        if (
          !queryType ||
          // starts with quotes regex.
          // TODO: Make it more robust
          quotedQueryName.match(/^['"`]/)
        ) {
          // @ts-expect-error - any type is allowed
          if (route.schema.querystring?.$ref) {
            throw new Error(
              `You cannot have Query or Query<'name'> and Query<{ name: string }> in the same route.`
            );
          }

          const queryName = unquote(quotedQueryName);

          route.parameters.push({
            value: `(request.query as { ${queryName}${
              optional ? '?' : ''
            }: string })['${queryName}']`
          });

          route.schema = deepmerge(route.schema, {
            querystring: {
              type: 'object',
              properties: { [queryName!]: { type: 'string' } },
              required: optional ? [] : [queryName]
            }
          });

          break;
        }

        // @ts-expect-error - any type is allowed
        if (route.schema.querystring?.properties) {
          throw new Error(
            `You cannot have Query or Query<'name'> and Query<{ name: string }> in the same route.`
          );
        }

        // Query is a whole object

        route.parameters.push({
          value: `request.query as ${quotedQueryName}`
        });

        route.schema = deepmerge(route.schema, {
          querystring: await schemaStorage.consumeNode(queryType!)
        });

        break;

      case 'Header':
        const headerNameGeneric = generics[0]?.getText(source);
        const headerName = headerNameGeneric
          ? unquote(headerNameGeneric)
          : parameter.name.getText(source);

        route.parameters.push({
          value: `(request.headers as { ${headerName}${
            optional ? '?' : ''
          }: string })['${headerName}']`
        });

        route.schema = deepmerge(route.schema, {
          headers: {
            type: 'object',
            properties: { [headerName]: { type: 'string' } },
            required: optional ? [] : [headerName]
          }
        });

        break;

      case 'Req':
        route.parameters.push({ value: 'request' });
        break;

      case 'Rep':
        route.parameters.push({ value: 'reply' });
        break;

      default:
        if (!typename) {
          throw new Error(
            `You did not provide a typename at ${parameter.parent.name?.getText(source)}`
          );
        }

        if (kitaConfig.params[typename]) {
          const genericNames = generics.map((n) => n.getText(source));

          const paramName = `param${index}`;

          route.parameters.push({
            helper: `const ${paramName} = await ${typename}.call(context, request, reply, [${genericNames.join(
              ', '
            )}]);`,
            value: paramName
          });

          break;
        }

        throw new Error(
          `Unknown parameter type ${typename}. Did you forget to include it in the \`params\` config?`
        );
    }
  }

  result.addImport(
    'controllers',
    `import * as ${route.controllerName} from '${importablePath(source.fileName)}';`
  );

  result.routes.push(route);
}
