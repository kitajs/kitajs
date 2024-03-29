# @kitajs/template

## Installing the project

Run the following command to install the project:

```bash
npm install
```

## Running in development mode

Run the following command to start the server in development mode:

```bash
npm run dev
```

You can now open your browser and navigate to [`http://localhost:1227`](http://localhost:1227).

## Building for production

Run the following command to build the project:

```bash
npm run build
```

Run the following command to start the server in production mode:

```bash
npm start
```

You can now open your browser and navigate to [`http://localhost:1227`](http://localhost:1227).

## Running tests

You can run the tests using the following command:

```bash
npm test
```

## Environment variables

Environment variables are loaded from a [`.env`](./.env) file in the root of the project. These are the available
variables:

```bash
# Port and host for the server
PORT=1227
HOST=0.0.0.0
```

## Linting and Formatting

You can run the following commands to lint and format your code:

```bash
# Formats your code
npm run format

# Lints your code
npm run lint

# Lints and fixes your code
npm run lint:fix

# Lints your code in CI mode
npm run lint:ci
```
