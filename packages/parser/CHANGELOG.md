# @kitajs/parser

## 1.1.18

### Patch Changes

- [#177](https://github.com/kitajs/kitajs/pull/177)
  [`dd14264`](https://github.com/kitajs/kitajs/commit/dd1426441f78df9d17146e6941d09f5a05a68d7b) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Added provider hook support

- Updated dependencies [[`dd14264`](https://github.com/kitajs/kitajs/commit/dd1426441f78df9d17146e6941d09f5a05a68d7b)]:
  - @kitajs/common@1.1.14

## 1.1.17

### Patch Changes

- [#174](https://github.com/kitajs/kitajs/pull/174)
  [`5f11bba`](https://github.com/kitajs/kitajs/commit/5f11bbae5fd755efc6953c47ddd494c45358954e) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Fixed CLI build

- Updated dependencies [[`5f11bba`](https://github.com/kitajs/kitajs/commit/5f11bbae5fd755efc6953c47ddd494c45358954e)]:
  - @kitajs/common@1.1.13

## 1.1.16

### Patch Changes

- [#150](https://github.com/kitajs/kitajs/pull/150)
  [`e571909`](https://github.com/kitajs/kitajs/commit/e5719094f9c0a81d1db5877f1cc32fe5ba12f218) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Provider type errors points to the correct node

- [#133](https://github.com/kitajs/kitajs/pull/133)
  [`d7d94de`](https://github.com/kitajs/kitajs/commit/d7d94de3290ae713c3c59f8236a328260ca76568) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Fixed watch mode infinite loop

- Updated dependencies [[`d7d94de`](https://github.com/kitajs/kitajs/commit/d7d94de3290ae713c3c59f8236a328260ca76568)]:
  - @kitajs/common@1.1.12

## 1.1.15

### Patch Changes

- [#128](https://github.com/kitajs/kitajs/pull/128)
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Reduced the number of configuration requried

- [#128](https://github.com/kitajs/kitajs/pull/128)
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Watch mode

- [#128](https://github.com/kitajs/kitajs/pull/128)
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Super fast code generation without tsc api

- Updated dependencies [[`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407),
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407),
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407),
  [`01dc430`](https://github.com/kitajs/kitajs/commit/01dc430d070aca17ee4494799651412b2ea8f9e2),
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407)]:
  - @kitajs/common@1.1.11

## 1.1.14

### Patch Changes

- cf9f086: Unusual providers registration order

## 1.1.13

### Patch Changes

- 92b6e28: Fixed win32 deep paths

## 1.1.12

### Patch Changes

- 59d2207: Automatically add properties to all required plugins.
- d004483: Warn on file without routes
- c79637a: Validate transformSchema function
- e29ff3f: Improved performance without incremental
- Updated dependencies [59d2207]
- Updated dependencies [d004483]
- Updated dependencies [c79637a]
  - @kitajs/common@1.1.10

## 1.1.11

### Patch Changes

- 8e6cc7c: Fixed package json links
- 573dfb2: Read JSDoc before response
- Updated dependencies [8e6cc7c]
- Updated dependencies [8e6cc7c]
  - @kitajs/common@1.1.9

## 1.1.10

### Patch Changes

- 54ff609: Primitive support for arrays
- b9fb8fd: Multipart formdata file support
- 788695e: Capitalized return type name
- Updated dependencies [b9fb8fd]
  - @kitajs/common@1.1.8

## 1.1.9

### Patch Changes

- 71167da: Add meaningful error message on return type error
- 49d47d1: Fixed primitive detection
- 47b1b05: Added support for @internal
- 8962743: Fixed operationId jsdoc
- 265fa5e: Prefer HttpErrors from @fastify/sensible
- 296492e: Added support for provider parameters
- 5c9709a: Multiple throws in a single line
- Updated dependencies [71167da]
- Updated dependencies [eb53fb4]
- Updated dependencies [296492e]
  - @kitajs/common@1.1.7

## 1.1.8

### Patch Changes

- a252854: Fixed html suspense routes

## 1.1.7

### Patch Changes

- Updated dependencies [cdced20]
  - @kitajs/common@1.1.6

## 1.1.6

### Patch Changes

- a2ed13d: Correct typescript imports with tjsg
- Updated dependencies [a2ed13d]
  - @kitajs/common@1.1.5

## 1.1.5

### Patch Changes

- dacfd17: Transpilation improvements with ts incremental program
- 0090a7e: Added typed errors with HttpErrors and @fastify/ansible.
- 745f34a: Relative runtime paths to dist
- d4aad0e: Inlined literal object types instead of phantom references
- Updated dependencies [0090a7e]
- Updated dependencies [d4aad0e]
  - @kitajs/common@1.1.4

## 1.1.4

### Patch Changes

- f9c378f: Support for windows

## 1.1.3

### Patch Changes

- Updated dependencies [f236d9f]
  - @kitajs/common@1.1.3

## 1.1.2

### Patch Changes

- 4798255: Pinned typescript to 5.1.6
- Updated dependencies [4798255]
  - @kitajs/common@1.1.2

## 1.1.1

### Patch Changes

- 9e47783: Added package descriptions
- 7dd662f: Fixed undefined paths in node <20 windows
- Updated dependencies [9e47783]
  - @kitajs/common@1.1.1

## 1.1.0

### Minor Changes

- 5bc3999: Overhaul package update

### Patch Changes

- 533b9e2: Updated peer dependencies
- Updated dependencies [e5e060b]
- Updated dependencies [5bc3999]
- Updated dependencies [533b9e2]
  - @kitajs/common@1.1.0
