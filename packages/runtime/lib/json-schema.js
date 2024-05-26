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

exports.addAjvSchemas = addAjvSchemas;
