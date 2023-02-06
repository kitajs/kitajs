<div align="right">
  <a href="https://github.com/arthurfiorette/kita">
    <img src="./assets/logo.png" height="172">
  </a>
</div>

<br />
 
<h1 align="center">Kita</h1>

<br />
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

```ts
// routes/hello-world.ts

export function get(name: Query = 'world') {
  return `Hello ${name}!`;
}
```

```sh
# Magic happens here 🪄
$ kita generate
> Exporting code to src/routes.ts
```

<br />
