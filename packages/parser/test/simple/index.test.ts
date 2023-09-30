import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Simple tests', async () => {
  const { kita } = await parseRoutes(__dirname);

  test('simple', () => {
    console.log(kita.routes);
  });
});
