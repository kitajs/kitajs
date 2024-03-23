import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import ts from 'typescript/lib/tsserverlibrary';
import { TSLangServer } from '../lang-server';

const routeIndex = path.join(__dirname, 'src/routes/index.ts');
const routeIndexContent = readFileSync(routeIndex, 'utf-8');

const providerIndex = path.join(__dirname, 'src/providers/index.ts');
const providerIndexContent = readFileSync(providerIndex, 'utf-8');

describe('No errors', () => {
  it('Parses route without errors', async () => {
    await using server = new TSLangServer(__dirname);

    await server.send({
      command: ts.server.protocol.CommandTypes.Open,
      arguments: {
        file: routeIndex,
        fileContent: routeIndexContent
      }
    });

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
      request_seq: 3,
      success: true,
      body: []
    });
  });

  it('Parses provider without errors', async () => {
    await using server = new TSLangServer(__dirname);

    await server.send({
      command: ts.server.protocol.CommandTypes.Open,
      arguments: {
        file: providerIndex,
        fileContent: providerIndexContent
      }
    });

    await server.send({
      command: ts.server.protocol.CommandTypes.Open,
      arguments: {
        file: routeIndex,
        fileContent: routeIndex
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
      request_seq: 3,
      success: true,
      body: []
    });
  });
});
