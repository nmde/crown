import axios from 'axios';
import path from 'path';
import models from '../src/backend/models';
import Server from '../src/backend/server';
import {
  Endpoints, EndpointProvider, Query, Response,
} from '../src/types/Endpoints';
import apiPath from '../src/util/apiPath';
import errors from '../src/util/errors';

const server = new Server();

async function post<T extends keyof Endpoints>(
  endpoint: keyof EndpointProvider,
  data: Partial<Query<T>>,
): Promise<Response<T>> {
  return (
    await axios.post<Response<T>>(`http://${path.join('localhost:3000', apiPath(endpoint))}`, data)
  ).data;
}

describe('stating the server', () => {
  it('starts succesfully', async () => {
    expect(await server.start()).toBeTruthy();
    // Clear the testing database so tests are run on a clean slate
    await models.User.destroy({
      where: {},
    });
  });
});

describe('createAccount', () => {
  const credentials1 = {
    username: 'johnsmith123',
    password: '12345',
    email: 'me@example.com',
  };
  const credentials2 = {
    username: 'exampleuser',
    password: '12345',
    email: 'user@foo.com',
  };
  it('creates an account directly', async () => {
    // Normal case - All the required information is present
    // 1 - test output directly
    const res = await server.createAccount(credentials1);
    expect(res.data).toHaveProperty('id');
    expect(res.error).toBeUndefined();
    // 2 - check the database
    const query = await server.database.models.User.findAndCountAll({
      where: {
        username: credentials1.username,
      },
    });
    expect(query.count).toBe(1);
    expect(query.rows[0].get('username')).toBe(credentials1.username);
  });
  it('creates an account via API', async () => {
    // Normal case - All the required information is present
    // 1 - test API response
    const res = await post<'createAccount'>('createAccount', credentials2);
    expect(res.data).toHaveProperty('id');
    expect(res.error).toBeUndefined();
    // 2 - check the database
    const query = await server.database.models.User.findAndCountAll({
      where: {
        username: credentials2.username,
      },
    });
    expect(query.count).toBe(1);
    expect(query.rows[0].get('username')).toBe(credentials2.username);
  });
  it('fails because username is already in use', async () => {
    // Error case - Username is already present in the database
    // 1 - test output for correct error message
    const res = await server.createAccount(credentials1);
    expect(res.data).toBeUndefined();
    expect(res.error).toBe(errors.USER_EXISTS);
    // 2 - test that nothing changed in the database
    const query = await server.database.models.User.findAndCountAll({
      where: {
        username: credentials1.username,
      },
    });
    expect(query.count).toBe(1);
  });
  it('fails because required information is missing', async () => {
    // Error case - API should fail if required information is not present
    // 1 - API should respond with code 400
    expect(async () => {
      await post<'createAccount'>('createAccount', {
        username: credentials2.username,
      });
    }).rejects.toThrow();
  });
});

it('signs in', async () => {
  // Normal case - All the required information present & correct
  const s1 = await server.signIn({
    username: 'johnsmith123',
    password: '12345',
  });
  expect(s1.data).toHaveProperty('id');
  expect(s1.error).toBeUndefined();
  // Incorrect password
  const s2 = await server.signIn({
    username: 'johnsmith123',
    password: 'password',
  });
  expect(s2.data).toBeUndefined();
  expect(s2.error).not.toBeUndefined();
});

it('creates a post', async () => {});

// TODO: change username/password, forgot password, delete entire account
// TODO: use mocks
