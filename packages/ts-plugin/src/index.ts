import path from 'node:path';
import { type KitaConfig, KitaError, importConfig, kProvidersFolder, kRoutesFolder, parseConfig } from '@kitajs/common';
import { KitaParser, toTsPath } from '@kitajs/parser';
import ts, { type server } from 'typescript/lib/tsserverlibrary';
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

      info.project.projectService.logger.info(
        `[kita-plugin] Started plugin for ${info.project.getProjectName()} at ${info.project.getCurrentDirectory()}`
      );

      proxy.getSemanticDiagnostics = function clonedSemanticDiagnostics(filename) {
        // ts typescript will return the path with / on windows
        filename = path.normalize(filename);

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
            loadParser(program, start);
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

      function loadParser(program: ts.Program, start: number) {
        // ts typescript will return the path with / on windows
        const root = path.normalize(program.getCurrentDirectory());

        try {
          config = importConfig(path.join(root, 'kita.config.js'));
        } catch {
          config = parseConfig({}, root);
        }

        // process.cwd() will return the editor cwd, and not the project cwd
        if (config.cwd === process.cwd()) {
          config.cwd = root;
        }

        rootRoute = path.resolve(config.src, kRoutesFolder);
        rootProvider = path.resolve(config.src, kProvidersFolder);
        providerPaths = program
          .getSourceFiles()
          .map((f) => f.fileName)
          .filter((f) => f.startsWith(toTsPath(rootProvider)));

        parser = new KitaParser(config, program);

        info.project.projectService.logger.info(
          `[kita-plugin] Successfully parsed config in ${performance.now() - start}ms`
        );

        info.project.projectService.logger.info(`[kita-plugin] ${JSON.stringify(config, null, 2)}`);
      }

      return proxy;
    }
  };
};
