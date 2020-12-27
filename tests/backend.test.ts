import fs from 'fs-extra';
import models from '../src/backend/models';
import Server from '../src/backend/server';

const server = new Server();

it('starts succesfully', async () => {
  expect(await server.start()).toBeTruthy();
  // Clear the testing database so tests are run on a clean slate
  await models.User.destroy({
    where: {},
  });
});

it('creates an account', async () => {
  const credentials = {
    username: 'johnsmith123',
    password: '12345',
    email: 'me@example.com',
  };
  // Normal case - All the required information present & correct
  const acc1 = await server.createAccount(credentials);
  expect(acc1.error).toBeUndefined();
  const query1 = await server.database.models.User.findAndCountAll();
  expect(query1.count).toBe(1);
  expect(query1.rows[0].get('username')).toBe('johnsmith123');
  // Error case - Username is already being used
  const acc2 = await server.createAccount(credentials);
  expect(acc2.error).not.toBeUndefined();
  const query2 = await server.database.models.User.findAndCountAll();
  expect(query2.count).toBe(1);
  // API endpoint & validation
});

it('signs in', async () => {
  // Normal case - All the required information present & correct
  const s1 = await server.signIn({
    username: 'johnsmith123',
    password: '12345',
  });
  expect(s1.data.id).not.toBe('');
  expect(s1.error).toBeUndefined();
  // Incorrect password
  const s2 = await server.signIn({
    username: 'johnsmith123',
    password: 'password',
  });
  expect(s2.data.id).toBe('');
  expect(s2.error).not.toBeUndefined();
});

it('creates a post', async () => {
  
});

// TODO: change username/password, forgot password, delete entire account
