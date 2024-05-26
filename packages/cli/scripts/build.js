const fs = require('node:fs');
const path = require('node:path');

async function run() {
  const workspaceRoot = path.resolve(__dirname, '../../..');
  const packagesRoot = path.resolve(workspaceRoot, 'packages');
  const templatesRoot = path.resolve(__dirname, '../templates');

  const packages = await fs.promises.readdir(packagesRoot, { encoding: 'utf-8' });

  const versionMap = {};

  for (const pkg of packages) {
    const pkgJson = require(path.resolve(packagesRoot, pkg, 'package.json'));
    versionMap[pkgJson.name] = pkgJson.version;
  }

  const templates = await fs.promises.readdir(templatesRoot, { encoding: 'utf-8' });

  for (const template of templates) {
    const pkgJson = require(path.resolve(templatesRoot, template, 'package.json'));

    // replaces all dependencies and devDependencies with the versions from the workspace
    pkgJson.dependencies = replaceDependencies(pkgJson.dependencies, versionMap);
    pkgJson.devDependencies = replaceDependencies(pkgJson.devDependencies, versionMap);

    await fs.promises.writeFile(
      path.resolve(templatesRoot, template, 'package.json'),
      `${JSON.stringify(pkgJson, null, 2)}\n`,
      { encoding: 'utf-8' }
    );
  }

  // biome-ignore lint/suspicious/noConsoleLog: build script
  console.log('Replaced dependencies in templates', versionMap);
}

function replaceDependencies(dependencies, versionMap) {
  for (const dep in dependencies) {
    if (versionMap[dep]) {
      dependencies[dep] = `^${versionMap[dep]}`;
    }
  }

  return dependencies;
}

if (process.env.KITA_RELEASE) {
  run().catch(console.error);
}
