import Handlebars from 'handlebars';
import type { Parameter } from '../parameter';

Handlebars.registerHelper('lowercase', (str: string) => str.toLowerCase());
Handlebars.registerHelper('json', (ctx) => JSON.stringify(ctx));
Handlebars.registerHelper('jsonf', (ctx) => JSON.stringify(ctx, null, 2));
Handlebars.registerHelper('paramsToString', (params: Parameter[]) =>
  params.map((p) => p.value || p).join(',')
);
Handlebars.registerHelper('hasSchemaTransformers', (params: Parameter[]) =>
  params.some((p) => p.schemaTransformer)
);
