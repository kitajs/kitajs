import { KitaConfig, KitaError, importConfig } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';
import { globSync } from 'glob';
import { minimatch } from 'minimatch';
import path from 'path';
import ts, { server } from 'typescript/lib/tsserverlibrary';
import { appendProviderDiagnostics } from './parsers/provider';
import { appendRouteDiagnostics } from './parsers/route';
import { proxyObject } from './util/proxy';

// TODO: Find a way to use the typescript/lib/tsserverlibrary ts inside
// @kitajs/parser without having to import it here.
export = function initHtmlPlugin() {
  return {
    create(info: server.PluginCreateInfo) {
      const proxy = proxyObject(info.languageService);

      let config: KitaConfig;
      let providerPaths: string[];
      let parser: KitaParser;

      proxy.getSemanticDiagnostics = function clonedSemanticDiagnostics(filename) {
        const diagnostics = info.languageService.getSemanticDiagnostics(filename);

        const start = performance.now();

        const program = info.languageService.getProgram()!;

        const source = program.getSourceFile(filename);

        if (!source) {
          return diagnostics;
        }

        try {
          // Lazy load the parser
          if (!config) {
            let root = program.getCurrentDirectory();
            config = importConfig(path.join(root, 'kita.config.js'));

            // process.cwd() will return the editor cwd, and not the project cwd
            if (config.cwd === process.cwd()) {
              config.cwd = root;
            }

            config.controllers.glob = config.controllers.glob.map((glob) => path.resolve(root, glob));
            config.providers.glob = config.providers.glob.map((glob) => path.resolve(root, glob));
            providerPaths = globSync(config.providers.glob, { cwd: config.cwd });
            parser = new KitaParser(config, [], [], program);
          }

          // Only parse files inside the cwd
          if (!filename.startsWith(config.cwd)) {
            return diagnostics;
          }

          // Searches if this file is a provider
          for (const glob of config.providers.glob) {
            if (minimatch(filename, glob)) {
              info.project.projectService.logger.info(
                `[kita-plugin] Parsed provider ${filename} in ${performance.now() - start}ms`
              );

              appendProviderDiagnostics(parser, source, diagnostics);
              return diagnostics;
            }
          }

          // Searches if this file is a controller
          for (const glob of config.controllers.glob) {
            if (minimatch(filename, glob)) {
              info.project.projectService.logger.info(
                `[kita-plugin] Parsed route ${filename} in ${performance.now() - start}ms`
              );

              appendRouteDiagnostics(parser, program, source, diagnostics, providerPaths);
              return diagnostics;
            }
          }
        } catch (error: any) {
          if (error instanceof KitaError) {
            diagnostics.push(error.diagnostic);
            return diagnostics;
          }

          info.project.projectService.logger.msg(`[kita-plugin] Error:\n${error.stack}`, ts.server.Msg.Err);
        }

        return diagnostics;
      };

      return proxy;
    }
  };
};
