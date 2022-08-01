import deepmerge from 'deepmerge';
import ts from 'typescript';
import { KitaGenerator } from './generator';
import { GeneratorResult, Route } from './generator-data';
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
  { kitaConfig, importablePath, jsonGenerator }: KitaGenerator,
  result: GeneratorResult
): Promise<void> {
  // Node is not a exported function.
  // TODO: Make it work with `export const get = () => {};`
  if (!isNodeExported(node) || node.kind !== ts.SyntaxKind.FunctionDeclaration) {
    return;
  }

  const fn = node as ts.FunctionDeclaration;

  const { controllerName, routePath } = filterRoute(source.fileName, kitaConfig);

  const route: Route = {
    method: fn.name!.getText(source).toLowerCase(),
    controllerName,
    path: routePath,
    config: {},
    parameters: []
  };

  for (let index = 0; index < fn.parameters.length; index++) {
    const parameter = fn.parameters[index]!;

    const name = parameter.name!.getText(source).trim();

    if (name === 'this') {
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

        route.config = deepmerge(route.config, {
          schema: {
            params: {
              type: 'object',
              properties: { [pathName]: { type: 'string' } },
              required: optional ? [] : [pathName]
            }
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

        const bodyType = generics[0];

        if (!bodyType) {
          throw new Error('Body must have a property type');
        }

        route.parameters.push({ value: `request.body as ${bodyType.getText(source)}` });

        route.config = deepmerge(route.config, {
          schema: { body: await jsonGenerator.generateRef(bodyType) }
        });

        break;

      case 'BodyProp':
        // TODO: Better error message
        if (route.method === 'get') {
          throw new Error(
            `The HTTP specification does not allow the use of Body in GET requests.`
          );
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

        route.config = deepmerge(route.config, {
          schema: {
            body: {
              type: 'object',
              properties: { [propName]: await jsonGenerator.generateRef(propType) },
              required: optional ? [] : [propName]
            }
          }
        });

        break;

      case 'Query':
        const queryType = generics[0];

        const quotedQueryName = queryType
          ? queryType.getText(source)
          : parameter.name.getText(source);

        if (
          !queryType ||
          // starts with quotes regex.
          // TODO: Make it more robust
          quotedQueryName.match(/^['"]/)
        ) {
          const queryName = unquote(quotedQueryName);

          route.parameters.push({
            value: `(request.query as { ${queryName}${
              optional ? '?' : ''
            }: string })['${queryName}']`
          });

          route.config = deepmerge(route.config, {
            schema: {
              querystring: {
                type: 'object',
                properties: { [queryName!]: { type: 'string' } },
                required: optional ? [] : [queryName]
              }
            }
          });

          break;
        }

        // Query is a whole object

        route.parameters.push({
          value: `request.query as ${queryType.getFullText(source)}`
        });

        route.config = deepmerge(route.config, {
          schema: {
            querystring: await jsonGenerator.generateRef(queryType!)
          }
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

        route.config = deepmerge(route.config, {
          schema: {
            headers: {
              type: 'object',
              properties: { [headerName]: { type: 'string' } },
              required: optional ? [] : [headerName]
            }
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
