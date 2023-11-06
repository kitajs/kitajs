import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { it } from 'node:test';
import ts from 'typescript/lib/tsserverlibrary';
import { TSLangServer } from '../lang-server';

const routeIndex = path.join(__dirname, 'src/routes/index.ts');
const routeIndexContent = readFileSync(routeIndex, 'utf-8');

const providerIndex = path.join(__dirname, 'src/providers/index.ts');
const providerIndexContent = readFileSync(providerIndex, 'utf-8');

it('Emits a ParameterResolverNotFoundError', async () => {
  await using server = new TSLangServer(__dirname);

  await server.send({
    command: ts.server.protocol.CommandTypes.Open,
    arguments: {
      file: routeIndex,
      fileContent: routeIndexContent
    }
  });

  await server.waitEvent('projectLoadingFinish');

  server.send({
    command: ts.server.protocol.CommandTypes.SemanticDiagnosticsSync,
    arguments: {
      file: routeIndex,
      fileContent: routeIndexContent,
      scriptKindName: 'TS'
    }
  });

  const response = await server.waitResponse('semanticDiagnosticsSync');

  assert.deepStrictEqual(response, {
    seq: 0,
    type: 'response',
    command: 'semanticDiagnosticsSync',
    request_seq: 2,
    success: true,
    body: [
      {
        start: { line: 1, offset: 25 },
        end: { line: 1, offset: 47 },
        text: 'This parameter type does not have a registered resolved. Did you forget to wrap it into a Body<>, Query<>, etc.?',
        code: 'kita - 301',
        category: 'error'
      }
    ]
  });
});

it('Emits a UntypedProviderError', async () => {
  await using server = new TSLangServer(__dirname);

  await server.send({
    command: ts.server.protocol.CommandTypes.Open,
    arguments: {
      file: providerIndex,
      fileContent: providerIndexContent
    }
  });

  await server.waitEvent('projectLoadingFinish');

  server.send({
    command: ts.server.protocol.CommandTypes.SemanticDiagnosticsSync,
    arguments: {
      file: providerIndex,
      fileContent: providerIndexContent,
      scriptKindName: 'TS'
    }
  });

  const response = await server.waitResponse('semanticDiagnosticsSync');

  assert.deepStrictEqual(response, {
    seq: 0,
    type: 'response',
    command: 'semanticDiagnosticsSync',
    request_seq: 2,
    success: true,
    body: [
      {
        start: { line: 5, offset: 1 },
        end: { line: 7, offset: 2 },
        text: 'The provider default export needs to have a explicit return type declared.',
        code: 'kita - 306',
        category: 'error'
      }
    ]
  });
});
