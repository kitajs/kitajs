import { Layout } from '../components/layout';

export function get() {
  return (
    <Layout>
      <h1>@kitajs/template</h1>
      <h2>Installing the project</h2>
      <p>Run the following command to install the project:</p>
      <pre>
        <code>npm install</code>
      </pre>
      <h2>Running in development mode</h2>
      <p>Run the following command to start the server in development mode:</p>
      <pre>
        <code>npm run dev</code>
      </pre>
      <p>
        You can now open your browser and navigate to{' '}
        <a href="http://localhost:1227">
          <code>http://localhost:1227</code>
        </a>
        .
      </p>
      <h2>Building for production</h2>
      <p>Run the following command to build the project:</p>
      <pre>
        <code>npm run build</code>
      </pre>
      <p>Run the following command to start the server in production mode:</p>
      <pre>
        <code>npm start</code>
      </pre>
      <p>
        You can now open your browser and navigate to{' '}
        <a href="http://localhost:1227">
          <code>http://localhost:1227</code>
        </a>
        .
      </p>
      <h2>Running tests</h2>
      <p>You can run the tests using the following command:</p>
      <pre>
        <code>npm test</code>
      </pre>
      <h2>Environment variables</h2>
      <p>
        Environment variables are loaded from a{' '}
        <a href="./.env">
          <code>.env</code>
        </a>{' '}
        file in the root of the project. These are the available variables:
      </p>
      <pre>
        <code># Port and host for the server PORT=1227 HOST=0.0.0.0</code>
      </pre>
      <h2>Linting and Formatting</h2>
      <p>You can run the following commands to lint and format your code:</p>
      <pre>
        <code>
          # Formats your code npm run format # Lints your code npm run lint # Lints and fixes your code npm run lint:fix
          # Lints your code in CI mode npm run lint:ci
        </code>
      </pre>
    </Layout>
  );
}
