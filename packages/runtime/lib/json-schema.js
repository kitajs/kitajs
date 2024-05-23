// Custom resolves that prefers a meaningful title over a random id
function buildLocalReference(json, _, __, i) {
  return String(json.$id || json.$title || json.name || `def-${i}`);
}

function addAjvSchemas(kitaSchemas) {
  return {
    customOptions(ajv) {
      if (typeof ajv?.addSchema !== 'function') {
        throw new Error('Invalid AJV instance provided');
      }

      for (const [name, schema] of Object.entries(kitaSchemas)) {
        schema.$id ??= name;
        ajv.addSchema(schema);
      }

      return ajv;
    }
  };
}

exports.buildLocalReference = buildLocalReference;
exports.addAjvSchemas = addAjvSchemas;
