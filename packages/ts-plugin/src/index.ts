import { mergeDefaults } from '@kitajs/common';
import { minimatch } from 'minimatch';
import { server, default as ts } from 'typescript/lib/tsserverlibrary';
import { appendProviderDiagnostics } from './parsers/provider';
import { appendRouteDiagnostics } from './parsers/route';
import { l, proxyObject } from './util';

// TODO: Find a way to use the typescript/lib/tsserverlibrary ts inside
// @kitajs/parser without having to import it here.
export = function initHtmlPlugin() {
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

          // Only parse files inside the cwd
          if (!filename.startsWith(config.cwd)) {
            return diagnostics;
          }

          // Searches if this file is a provider
          for (const glob of config.providers.glob) {
            if (minimatch(filename, glob)) {
              appendProviderDiagnostics(config, program, source, diagnostics);
              return diagnostics;
            }
          }

          // Searches if this file is a controller
          for (const glob of config.controllers.glob) {
            if (minimatch(filename, glob)) {
              appendRouteDiagnostics(config, program, source, diagnostics);
              return diagnostics;
            }
          }
        } catch (error: any) {
          l('Error:');
          l(error);
        }

        return diagnostics;
      };

      return proxy;
    }
  };
};
