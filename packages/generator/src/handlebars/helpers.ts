import Handlebars from 'handlebars';
import type { Parameter } from '../parameter';

Handlebars.registerHelper('values', (ctx) => Object.values(ctx));
Handlebars.registerHelper('keys', (ctx) => Object.keys(ctx));
Handlebars.registerHelper('entries', (ctx) => Object.entries(ctx));
Handlebars.registerHelper('uppercase', (str: string) => str.toUpperCase());
Handlebars.registerHelper('lowercase', (str: string) => str.toLowerCase());
Handlebars.registerHelper('json', (ctx) => JSON.stringify(ctx));
Handlebars.registerHelper('jsonf', (ctx) => JSON.stringify(ctx, null, 2));
Handlebars.registerHelper('isAllMethod', (str: string) => str.toLowerCase() === 'all');
Handlebars.registerHelper('paramsToString', (params: Parameter[]) =>
  params.map((p) => p.value || p).join(',')
);
Handlebars.registerHelper('hasSchemaTransformers', (params: Parameter[]) =>
  params.some((p) => p.schemaTransformer)
);
