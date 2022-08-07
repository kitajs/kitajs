import Handlebars from 'handlebars';
import type { Parameter } from '../generator-data';

Handlebars.registerHelper('values', (ctx) => Object.values(ctx));
Handlebars.registerHelper('keys', (ctx) => Object.keys(ctx));
Handlebars.registerHelper('entries', (ctx) => Object.entries(ctx));
Handlebars.registerHelper('json', (ctx) => JSON.stringify(ctx));
Handlebars.registerHelper('paramsToString', (param: Parameter[]) =>
  param.map((p) => p.value).join(',')
);
