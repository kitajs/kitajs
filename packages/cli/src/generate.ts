import { createConfigExplorer, mergeDefaults, KitaConfig } from '@kita/core';
import { sync as globSync } from 'glob';
import ts, { createProgram } from 'typescript';
import path from 'path';
import fs from 'fs';

export async function generate() {
  const configs = await createConfigExplorer();
  const config = mergeDefaults(configs?.config);

  const files = config.controllers.glob.flatMap((file) => globSync(file));
  const tsconfig = require(path.resolve(process.cwd(), config.tsconfig));

  const program = createProgram(files, tsconfig.compilerOptions);

  const imports = new Set();
  const routes = [] as string[];

  for (const source of program.getSourceFiles().filter((s) => !s.isDeclarationFile)) {
    ts.forEachChild(source, (node) => {
      const result = visit(node as ts.FunctionDeclaration, source, config);

      if (!result) {
        return;
      }

      result.imports.forEach((r) => imports.add(r.trim()));
      routes.push(result.route.trim());
    });
  }

  const file = `
import '@fastify/cookie';
import type { FastifyInstance } from 'fastify';

${Array(...imports).join('\n')}

export function applyRouter(app: FastifyInstance, context: KitaContext) {
  ${routes.join('\n\n ')}
}
`;

  await fs.promises.writeFile(path.resolve(process.cwd(), config.routes.output), file);
}

function visit(node: ts.FunctionDeclaration, source: ts.SourceFile, config: KitaConfig) {
  if (
    // Only visit exported nodes
    !isNodeExported(node) ||
    // Only visit functions
    node.kind !== ts.SyntaxKind.FunctionDeclaration
  ) {
    return;
  }

  const methodName = node.name?.getText(source);

  if (!isRouteMethod(methodName)) {
    return;
  }

  const parameters = node.parameters.map((param) => ({
    //@ts-expect-error - type later
    type: param.type?.typeName?.escapedText,
    //@ts-expect-error - type later
    generics: param.type?.typeArguments?.map((i) => i.literal?.text) as string[]
  }));

  const apiPath = source.fileName
    .replace('src/api/', '')
    .replace('/api', '')
    .replace('.ts', '')
    .replace('index', '');

  const routeIdentifier =
    (apiPath
      .split('/')
      .map((i) => i.charAt(0).toUpperCase() + i.slice(1))
      .join('') || 'Index') + 'Controller';

  return {
    imports: [
      `import * as ${routeIdentifier} from '${path
        .relative(config.routes.output, source.fileName)
        .replace('../', './')
        .replace('.ts', '')}';`
    ],
    route: `
  app.${methodName}('/${apiPath}', async (req, reply) => {
    const response = await ${routeIdentifier}.${methodName}.call(
      context,

      ${parameters
      .map((param) => getParameterCode(param.type, param.generics))
      .filter(Boolean)
      .join(',\n      ')}
    );

    return reply.send(response);
  });
`
  };
}

function isRouteMethod(name?: string) {
  return (
    name &&
    ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'all'].includes(name)
  );
}

function getParameterCode(type?: string, generics?: string[]): string | undefined {
  generics ??= [];

  switch (type) {
    case 'Path':
      if (!generics[0]) {
        throw new Error('Path must have a name');
      }

      return `(req.params as any)['${generics[0]}']`;

    case 'Cookie':
      if (!generics[0]) {
        throw new Error('Cookie must have a name');
      }

      return `(req.cookies as any)['${generics[0]}']`;

    case 'Body':
      return 'req.body as any';

    case 'BodyProp':
      if (!generics[1]) {
        throw new Error('BodyProp must have a path');
      }

      return `(req.body as any)['${generics[1].split('.').join("']?.['")}']`;

    case 'Query':
      return generics[0] ? `(req.query as any)['${generics}']` : 'req.query as any';

    case 'Header':
      if (!generics[0]) {
        throw new Error('Header must have a name');
      }

      return `req.headers['${generics[0]}'] as string || ''`;

    case 'Req':
      return 'req';

    case 'Reply':
      return 'reply';

    default:
      return;
  }
}

/** True if this is visible outside this file, false otherwise */
function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !==
      0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}
