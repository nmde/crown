import Server from '../src/backend/server';

const server = new Server();

it('starts succesfully', async () => {
  expect(await server.start()).toBeTruthy();
});

it('creates an account', async () => {
  expect(
    (
      await server.createAccount({
        username: 'johnsmith123',
      })
    ).id,
  ).toBe(1234);
});
