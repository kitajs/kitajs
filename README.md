<a href="https://github.com/arthurfiorette/kita">
  <img src="./assets/logo.png" height="256">
</a>

<br />
 
<h1>Kita</h1>

<br />

Kita is a semi-opinionated fastify based typescript framework that has 0 runtime bloat
using code generation. It generates OpenAPI compliant routes, only requires functional
programming patterns, is 100% testable and supports all the usual features of fastify.

<br />

> This framework is being slowly built because one of the main goals is developer
> experience, so the API design is being carefully designed and tested by other
> developers. A fast and lightweight architecture is also one of many initial
> requirements.

<br />

**There's no documentation yet. For now, take a look at the [test](packages/test-package)
package.**

**If you want to understand how Kita achieves 0 runtime code and is 100% modular and open
api compliant, see the [routes.ts](packages/test-package/src/routes.ts) generated file.**

<br />

```ts
// /routes/hello/[name].ts

// Configurations read from typings at compile time!!
// (No runtime code == blazingly fast ⚡⚡)
export function get(this: Route<'helloWorld'>, name: Path<'name'> = 'World') {
  return `Hello ${name}`;
}
```

```sh
# Magic happens here 🪄
$ kita generate
```

```ts
// /main.ts

import { Kita } from './routes'; // Generated code
import fastify from 'fastify';

const app = fastify();

app.register(Kita, { context: {} });

app.listen();
```

<br />
