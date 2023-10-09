# Simple kitajs example

This is a simple example of kitajs usage.

All your routes are exported inside the `src/routes` folder. Their path will be the route path and their name the HTTP
method.

You can register multiple parameters anytime you want, they will be automatically extracted **AND VALIDATED** for you
from the request.

A swagger documentation is automatically generated from your routes and is available at `/docs`.

KitaJS reads interface types at compile time, so you can change your interface and it will be automatically updated in
the swagger documentation and the validation of your routes.

Providers are automatically injected in your routes, create a default export inside `src/providers` and make sure to
explicitly add a return type reference. After that, just import the type as this `UserId` (see
[here](src/providers/user-id.ts) and [here](src/routes/user.ts)) example does.

## How to run

⚠️ You must build from source until the first release.

```bash
pnpm install

pnpm build

cd packages/example

pnpm start
```

## VSCode intellisense

Make sure your vscode extension is using the project's typescript:

```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

Restart vscode and kitajs will add JIT intellisense and validation to your editor.

This also works any any other editor that uses a typescript LSP with support for typescript plugins.
