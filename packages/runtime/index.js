const { addAjvSchemas } = require('./lib/json-schema.js');
const { Kita } = require('./lib/plugin.js');
const { KitaSwagger } = require('./lib/swagger-plugin.js');

exports.addAjvSchemas = addAjvSchemas;
exports.Kita = Kita;
exports.KitaSwagger = KitaSwagger;
