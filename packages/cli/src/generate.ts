import { createConfigExplorer, KitaConfig, mergeDefaults } from '@kita/core';
import type { FastifySchema } from 'fastify';
import fs from 'fs';
import { sync as globSync } from 'glob';
import path from 'path';
import prettier from 'prettier';
import {
  Config as JsonConfig,
  createFormatter,
  createParser,
  SchemaGenerator
} from 'ts-json-schema-generator';
import ts, { createProgram } from 'typescript';

export async function generate() {
  const configs = await createConfigExplorer();
  const rootPath = configs?.filepath ? path.dirname(configs.filepath) : process.cwd();

  const config = mergeDefaults(configs?.config);

  const outputPath = path.resolve(rootPath, config.routes.output);
  const outputFolder = path.dirname(outputPath);

  const files = config.controllers.glob.flatMap((file) => globSync(file));
  const tsconfigPath = path.resolve(rootPath, config.tsconfig);
  const tsconfig = require(tsconfigPath);

  const program = createProgram(files, tsconfig.compilerOptions);
  const typeChecker = program.getTypeChecker();

  const jsonConfig: JsonConfig = { tsconfig: tsconfigPath };
  const typeFormatter = createFormatter(jsonConfig);
  const nodeParser = createParser(program, jsonConfig);
  const generator = new SchemaGenerator(program, nodeParser, typeFormatter, jsonConfig);

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

${Array(...imports).join('\n')}

${Object.entries(config.params)
  .map(([name, p]) => {
    const paramPath = path.resolve(rootPath, p);
    return `import ${name}Resolver from './${path.relative(outputFolder, paramPath)}';`;
  })
  .join('\n')}

export function applyRouter(app: FastifyInstance, providedContext: ProvidedRouteContext) {
  const context: RouteContext = {
    ...providedContext,
    config: ${JSON.stringify(config)},
  };

  ${routes.join('\n\n ')}
}
`;

  await fs.promises.writeFile(
    outputPath,
    prettier.format(file, {
      parser: 'typescript',

      //TODO: Customize prettier config
      arrowParens: 'always',
      bracketSpacing: true,
      endOfLine: 'lf',
      insertPragma: false,
      bracketSameLine: false,
      jsxSingleQuote: false,
      printWidth: 90,
      proseWrap: 'always',
      quoteProps: 'as-needed',
      requirePragma: false,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'none',
      useTabs: false
    })
  );
}

function visit(
  node: ts.FunctionDeclaration,
  source: ts.SourceFile,
  config: KitaConfig,
  generator: SchemaGenerator,
  _typeChecker: ts.TypeChecker
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
      name: param.name.getFullText(source).trim(),
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
  app.${methodName}(
    '/${pathname}',
    { schema: ${JSON.stringify(schema)} },
    async (req, reply) => {

      ${parameters
        .map((p) => {
          if (internalParams.includes(p.type)) return undefined;
          return `const ${p.name} = await ${
            p.type
          }Resolver.call(context, req, reply, [${p.generics
            .map((n) => `'${n}'`)
            .join(', ')}]);

      if (reply.sent) {
        return undefined as any;
      }`;
        })
        .filter(Boolean)
        .join(`\n    `)}

      const promise = ${routeIdentifier}.${methodName}.call(
        context,
        ${parameters
          .map((param) =>
            getParameterCode(param.name, config, param.type, param.generics)
          )
          .filter(Boolean)
          .join(',\n        ')}
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

const internalParams = [
  'Path',
  'Cookie',
  'Body',
  'BodyProp',
  'Query',
  'Header',
  'Req',
  'Rep'
];

function getParameterCode(
  paramName: string,
  config: KitaConfig,
  type?: string,
  generics?: string[]
): string | undefined {
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
      if (type && Object.keys(config.params).includes(type)) {
        return paramName;
      }

      throw new Error(
        `Unknown parameter type ${type}. Did you forget to include it in the \`params\` config?`
      );
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
