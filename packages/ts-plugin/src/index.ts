import { mergeDefaults } from '@kitajs/common';
import { globSync } from 'glob';
import type { default as TS, server } from 'typescript/lib/tsserverlibrary';
import { parseSingleFile } from './program-parser';
import { l, proxyObject } from './util';

export = function initHtmlPlugin(modules: { typescript: typeof TS }) {
  //@ts-ignore - TODO: See way of changing the TS import used inside @kitajs/parser
  const ts = modules.typescript;

  return {
    create(info: server.PluginCreateInfo) {
      const proxy = proxyObject(info.languageService);

      proxy.getSemanticDiagnostics = function clonedSemanticDiagnostics(filename) {
        const diagnostics = info.languageService.getSemanticDiagnostics(filename);

        try {
          let program = info.languageService.getProgram()!;
          const source = program?.getSourceFile(filename);

          if (!source) {
            return diagnostics;
          }

          let root = program.getCurrentDirectory();

          const config = mergeDefaults({
            cwd: root,
            tsconfig: ts.findConfigFile(root, ts.sys.fileExists, 'tsconfig.json')!
          });

          // TODO: only calculate this once
          const controllerPaths = globSync(config.controllers.glob, { cwd: root, absolute: true });

          if (!controllerPaths.includes(filename)) {
            return diagnostics;
          }

          parseSingleFile(config, program, filename, diagnostics);
        } catch (error: any) {
          l(error);
        }

        return diagnostics;
      };

      return proxy;
    }
  };
};
