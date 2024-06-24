# @kitajs/common

## 1.2.0

### Minor Changes

- Test code against node v20 and v22 ([#396](https://github.com/kitajs/kitajs/issues/396))
  ([b237991](https://github.com/kitajs/kitajs/commit/b23799177298876c7976864df97c85661c26cdde))

### Patch Changes

- ts-json-schema-generator v2.0 ([#419](https://github.com/kitajs/kitajs/issues/419))
  ([c601f94](https://github.com/kitajs/kitajs/commit/c601f94e1487325f2d03fe4f0fcf5c2d4c9aba8c))
- Added biomejs for code lint ([#398](https://github.com/kitajs/kitajs/issues/398))
  ([7f31e56](https://github.com/kitajs/kitajs/commit/7f31e5667e534dcd9607c02059bd61503dd2943b))
- Improved plugins registration with collision detection ([#397](https://github.com/kitajs/kitajs/issues/397))
  ([a379097](https://github.com/kitajs/kitajs/commit/a379097d7d764264a72219d890984dfa8eeea3b5))
- Migrated to an entire sync api ([#432](https://github.com/kitajs/kitajs/issues/432))
  ([39d26a3](https://github.com/kitajs/kitajs/commit/39d26a3d223e4e7f9a35616245144859f40c632e))
- Native support for Kita/Html v4 ([#393](https://github.com/kitajs/kitajs/issues/393))
  ([effed69](https://github.com/kitajs/kitajs/commit/effed6976bea36b88860712ed1cc8bc0b78156c0))
- Reduced final npm bundle size by ~100kb
  ([6a23155](https://github.com/kitajs/kitajs/commit/6a23155b8f220793b03738b09e3d3b0b11724b07))

## 1.1.16

### Patch Changes

- [#248](https://github.com/kitajs/kitajs/pull/248)
  [`02bb613`](https://github.com/kitajs/kitajs/commit/02bb613dc9b059a03a0ab084b8785da43c7c1160) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Added Schemas provider

## 1.1.15

### Patch Changes

- [#225](https://github.com/kitajs/kitajs/pull/225)
  [`ae9fd08`](https://github.com/kitajs/kitajs/commit/ae9fd0886902e48dba8a958c54054d5b99e387ed) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Correctly handle default exported routes

- [#232](https://github.com/kitajs/kitajs/pull/232)
  [`219e11e`](https://github.com/kitajs/kitajs/commit/219e11ecea4301a7e727c6bae38b35040b065b73) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Support for providers to interact with route schema

## 1.1.14

### Patch Changes

- [#177](https://github.com/kitajs/kitajs/pull/177)
  [`dd14264`](https://github.com/kitajs/kitajs/commit/dd1426441f78df9d17146e6941d09f5a05a68d7b) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Added provider hook support

## 1.1.13

### Patch Changes

- [#174](https://github.com/kitajs/kitajs/pull/174)
  [`5f11bba`](https://github.com/kitajs/kitajs/commit/5f11bbae5fd755efc6953c47ddd494c45358954e) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Fixed CLI build

## 1.1.12

### Patch Changes

- [#133](https://github.com/kitajs/kitajs/pull/133)
  [`d7d94de`](https://github.com/kitajs/kitajs/commit/d7d94de3290ae713c3c59f8236a328260ca76568) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Fixed watch mode infinite loop

## 1.1.11

### Patch Changes

- [#128](https://github.com/kitajs/kitajs/pull/128)
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Reduced the number of configuration requried

- [#128](https://github.com/kitajs/kitajs/pull/128)
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Watch mode

- [#128](https://github.com/kitajs/kitajs/pull/128)
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Useful error message when runtime cannot be found

- [#122](https://github.com/kitajs/kitajs/pull/122)
  [`01dc430`](https://github.com/kitajs/kitajs/commit/01dc430d070aca17ee4494799651412b2ea8f9e2) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - RouteSchema support for swagger types

- [#128](https://github.com/kitajs/kitajs/pull/128)
  [`e7f9862`](https://github.com/kitajs/kitajs/commit/e7f9862753db3956a0499b38e47b98af1a283407) Thanks
  [@arthurfiorette](https://github.com/arthurfiorette)! - Super fast code generation without tsc api

## 1.1.10

### Patch Changes

- 59d2207: Automatically add properties to all required plugins.
- d004483: Warn on file without routes
- c79637a: Validate transformSchema function

## 1.1.9

### Patch Changes

- 8e6cc7c: Fixed package json links
- 8e6cc7c: Encode refs defaults to false

## 1.1.8

### Patch Changes

- b9fb8fd: Multipart formdata file support

## 1.1.7

### Patch Changes

- 71167da: Add meaningful error message on return type error
- eb53fb4: Removed tsx requirement
- 296492e: Added support for provider parameters

## 1.1.6

### Patch Changes

- cdced20: Read configurations from env varibles

## 1.1.5

### Patch Changes

- a2ed13d: Correct typescript imports with tjsg

## 1.1.4

### Patch Changes

- 0090a7e: Added typed errors with HttpErrors and @fastify/ansible.
- d4aad0e: Inlined literal object types instead of phantom references

## 1.1.3

### Patch Changes

- f236d9f: Test deployments

## 1.1.2

### Patch Changes

- 4798255: Pinned typescript to 5.1.6

## 1.1.1

### Patch Changes

- 9e47783: Added package descriptions

## 1.1.0

### Minor Changes

- 5bc3999: Overhaul package update

### Patch Changes

- e5e060b: Fixed dependencies
- 533b9e2: Updated peer dependencies
