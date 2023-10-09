import { KitaConfig, KitaError, importConfig } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';
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

      let rootProvider: string;
      let rootRoute: string;

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

            rootRoute = path.resolve(config.cwd, config.routeFolder);
            rootProvider = path.resolve(config.cwd, config.providerFolder);

            parser = new KitaParser(config, [], [], program);
          }

          // Only parse files inside the cwd
          if (!filename.startsWith(config.cwd)) {
            return diagnostics;
          }

          // Searches if this file is a provider
          if (filename.startsWith(rootProvider)) {
            info.project.projectService.logger.info(
              `[kita-plugin] Parsed provider ${filename} in ${performance.now() - start}ms`
            );

            appendProviderDiagnostics(parser, source, diagnostics);
            return diagnostics;
          }

          // Searches if this file is a route
          if (filename.startsWith(rootRoute)) {
            info.project.projectService.logger.info(
              `[kita-plugin] Parsed route ${filename} in ${performance.now() - start}ms`
            );

            appendRouteDiagnostics(parser, program, source, diagnostics, providerPaths);
            return diagnostics;
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
