import type { Query } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

type Extended = {
  a: string;
  b: number;
};

export function get(age: Query<number>, extended: Query<Extended>) {
  return { age, extended };
}

describe('query will throw', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it.concurrent('logs error on creation', async () => {
    const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();

    await test;

    expect(consoleLogMock).toBeCalledTimes(1);
    expect(consoleLogMock.mock.calls[0]![0]).toContain(
      'You cannot have a named and a extended query object in the same method'
    );

    consoleLogMock.mockRestore();
  });

  it.concurrent('should not have the get route ast', async () => {
    const { KitaAST } = await test;
    expect(KitaAST.routes).toHaveLength(0);
  });
});
