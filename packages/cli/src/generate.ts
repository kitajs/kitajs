import { createConfigExplorer, KitaConfig, mergeDefaults } from '@kita/core';
import type { FastifySchema } from 'fastify';
import fs from 'fs';
import { sync as globSync } from 'glob';
import path from 'path';
import {
  Config as JsonConfig,
  createFormatter,
  createParser,
  SchemaGenerator
} from 'ts-json-schema-generator';
import ts, { createProgram } from 'typescript';

export async function generate() {
  const configs = await createConfigExplorer();
  const config = mergeDefaults(configs?.config);

  const files = config.controllers.glob.flatMap((file) => globSync(file));
  const tsconfigPath = path.resolve(process.cwd(), config.tsconfig);
  const tsconfig = require(tsconfigPath);

  const program = createProgram(files, tsconfig.compilerOptions);
  const typeChecker = program.getTypeChecker();

  const jsonConfig: JsonConfig = { tsconfig: tsconfigPath };
  const generator = new SchemaGenerator(
    program,
    createParser(program, jsonConfig),
    createFormatter(jsonConfig),
    jsonConfig
  );

  const imports = new Set();
  const routes = [] as string[];

  for (const source of program.getSourceFiles().filter((s) => !s.isDeclarationFile)) {
    ts.forEachChild(source, (node) => {
      const result = visit(
        node as ts.FunctionDeclaration,
        source,
        config,
        generator,
        typeChecker
      );

      if (!result) {
        return;
      }

      result.imports.forEach((r) => imports.add(r.trim()));
      routes.push(result.route.trim());
    });
  }

  const file = `
import '@fastify/cookie';

import type { RouteContext, ProvidedRouteContext } from '@kita/runtime';
import { RouterUtils } from '@kita/runtime';
import type { FastifyInstance } from 'fastify';
import Config from '${config.runtimeConfig}';

${Array(...imports).join('\n')}

export function applyRouter(app: FastifyInstance, providedContext: ProvidedRouteContext) {
  const context: RouteContext = {
    ...providedContext,
    kita: Config,
    config: ${JSON.stringify(config)},
  };

  ${routes.join('\n\n ')}
}
`;

  await fs.promises.writeFile(path.resolve(process.cwd(), config.routes.output), file);
}

function visit(
  node: ts.FunctionDeclaration,
  source: ts.SourceFile,
  config: KitaConfig,
  generator: SchemaGenerator,
  _: ts.TypeChecker
) {
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

  const parameters = node.parameters
    .filter((p) => p.name.getFullText(source).trim() !== 'this')
    .map((param) => ({
      //@ts-expect-error - type later
      type: param.type?.typeName?.escapedText,
      //@ts-expect-error - type later
      generics: param.type?.typeArguments?.map((i) => i.literal?.text) as string[],
      //@ts-expect-error - type later
      genericNodes: param.type?.typeArguments
    }));

  const schema: FastifySchema = {};

  for (const parameter of parameters) {
    switch (parameter.type) {
      case 'Body': {
        const type = parameter.genericNodes[0];

        if (!type) {
          throw new Error('Body must have a type');
        }

        schema.body = generator.createSchemaFromNodes([type]);

        break;
      }

      case 'BodyProp': {
        const type = parameter.genericNodes[0];

        if (!type) {
          throw new Error('BodyProp must have a type');
        }

        schema.body ??= {};
        //@ts-expect-error - type later
        schema.body!.properties ??= {};
        //@ts-expect-error - type later
        schema.body!.properties![parameter.type] = generator.createSchemaFromNodes([
          type
        ]);
        break;
      }

      case 'Query': {
        const generic = parameter.genericNodes[0];
        const name = parameter.generics[0];

        // Query
        if (!name) {
          schema.querystring = generator.createSchemaFromNodes([generic]);
        } else {
          // FieldQuery

          schema.querystring ??= {};
          //@ts-expect-error - type later
          schema.querystring!.properties ??= {};
          //@ts-expect-error - type later
          schema.querystring!.properties![name] = generator.createSchemaFromNodes([
            generic
          ]);

          break;
        }

        break;
      }
    }
  }

  // return type
  // TODO: Fazer funcionar isto daqui
  // {
  //   const signature = typeChecker.getSignatureFromDeclaration(node)!;
  //   const returnType = typeChecker.getReturnTypeOfSignature(signature);

  //   if (returnType.symbol.valueDeclaration) {
  //     schema.response = generator.createSchemaFromNodes([
  //       returnType.symbol.valueDeclaration
  //     ]);
  //   }
  // }

  const pathname = source.fileName
    .replace('src/api/', '')
    .replace('/api', '')
    .replace('.ts', '')
    .replace('index', '')
    .replace(/\[(\w+)\]/gm, ':$1');

  const routeIdentifier =
    (pathname
      .replace(/\:/g, '$')
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
  app.${methodName}('/${pathname}', { schema: ${JSON.stringify(
      schema
    )} }, async (req, reply) => {
    const promise = ${routeIdentifier}.${methodName}.call(
      context,
      ${parameters
        .map((param) => getParameterCode(param.type, param.generics))
        .filter(Boolean)
        .join(',\n      ')}
    );

    return RouterUtils.sendResponse.call(context, req, reply, promise);
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

      return `req.headers['${generics[0].toLowerCase()}'] as string || ''`;

    case 'Req':
      return 'req';

    case 'Rep':
      return 'reply';

    default:
      return `Config.parameterResolvers.${type}.apply(context, [req, reply, [${generics.join(
        ','
      )}]])`;
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
