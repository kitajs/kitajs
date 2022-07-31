import Handlebars from 'handlebars';

Handlebars.registerHelper('values', (ctx) => Object.values(ctx));
Handlebars.registerHelper('keys', (ctx) => Object.keys(ctx));
Handlebars.registerHelper('entries', (ctx) => Object.entries(ctx));
Handlebars.registerHelper('json', (ctx) => JSON.stringify(ctx));

Handlebars.registerHelper('paramsToString', (params) =>
  // TODO: type check params
  params.map((p: any) => p.value).join(',')
);
