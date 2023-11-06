<p align="center">
   <b>Using this package?</b> Please consider <a href="https://github.com/sponsors/arthurfiorette" target="_blank">donating</a> to support my open source work ❤️
  <br />
  <sup>
   Help kitajs grow! Star and share this amazing repository with your friends and co-workers!
  </sup>
</p>

<br />

<p align="center" >
  <a href="https://kita.js.org" target="_blank" rel="noopener noreferrer">
    <img src="https://kita.js.org/logo.png" width="180" alt="Kita JS logo" />
  </a>
</p>

<br />

<div align="center">
  <a title="MIT license" target="_blank" href="https://github.com/kitajs/kitajs/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/github/license/kitajs/kitajs"></a>
  <a title="Codecov" target="_blank" href="https://app.codecov.io/gh/kitajs/kitajs"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/kitajs/kitajs?token=ML0KGCU0VM"></a>
  <a title="Last Commit" target="_blank" href="https://github.com/kitajs/kitajs/commits/master"><img alt="Last commit" src="https://img.shields.io/github/last-commit/kitajs/kitajs"></a>
  <a href="https://github.com/kitajs/kitajs/stargazers"><img src="https://img.shields.io/github/stars/kitajs/kitajs?logo=github&label=Stars" alt="Stars"></a>
</div>

<br />
<br />

<h1>🌷 KitaJS</h1>

<p align="center">
  <a href="https://kita.js.org" target="_blank">KitaJS</a> is a routing meta framework.
  <br />
  <br />
</p>

<br />

## You are probably looking for the [minimal-example](https://github.com/kitajs/minimal-example)

<br />
<br />

> [!NOTE]  
> This project is undocumented and WIP. I'm working as hard as I can to make it usable, but it's not ready yet. Expect
> the first oficial release ~jan/2024.

<br />

Things to document:

- Route operationId re-exports cannot be used in the first tick of the nodejs process in order to avoid circular
  dependencies. They must be used in the second tick or imported directly from the routes/... file.
  (`await Runtime.ready`)

- `keyword: "isFile"` error when multipart ajv plugin is not present.

- Document that kita global root is required.
