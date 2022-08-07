# 🖥 Kita

Kita is a semi-opinionated fastify based typescript framework that has 0 runtime bloat
using code generation. It generates OpenAPI compliant routes, only requires functional
programming patterns, is 100% testable and supports all the usual features of fastify.

> This framework is being slowly built because one of the main goals is developer
> experience, so the API design is being carefully designed and tested by other
> developers. A fast and lightweight architecture is also one of the initial requirements.

**There's no documentation yet. For now, take a look at the [test](packages/test)
package.**

**If you want to understand how Kita achieves 0 runtime code and is 100% modular and open
api compliant, see the [routes.ts](packages/test/src/routes.ts) generated file.**

```ts
// /routes/hello-world.ts
import type { Route } from '@kita/runtime';

export function get(this: Route<'helloWorld'>) {
  return 'Hello World';
}
```

```ts
// /routes/hello/[name].ts

// Configurations done by typings!! (No runtime code = blazingly fast ⚡)
export function get(this: Route<'hello'>, name: Path<'name'>) {
  return `Hello ${name}`;
}
```

```sh
# The magic happens here
$ kita generate
```

```ts
// /main.ts

import { applyRouter } from './routes'; // Generated code
import fastify from 'fastify';

const app = fastify();

applyRouter(app, {});

app.listen();
```
