import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';

export function compileTemplate(templatePath: string, rootPath: string) {
  const resolvedTemplatePath = templatePath.startsWith('.')
    ? // local file
      path.resolve(rootPath, templatePath)
    : // module import
      require.resolve(templatePath);

  const template = fs.readFileSync(resolvedTemplatePath).toString();

  return Handlebars.compile(template, {
    noEscape: true
  });
}
