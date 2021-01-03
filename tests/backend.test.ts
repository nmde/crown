import Tokenize from '@cyyynthia/tokenize';
import axios from 'axios';
import path from 'path';
import models from '../src/backend/models';
import Server from '../src/backend/server';
import {
  Endpoints, EndpointProvider, Query, Response,
} from '../src/types/Endpoints';
import apiPath from '../src/util/apiPath';
import errors from '../src/util/errors';

const port = 3001;
const token = new Tokenize(process.env.AUTHKEY as string);

const server = new Server();
const { User } = server.database.models;

async function post<T extends keyof Endpoints>(
  endpoint: keyof EndpointProvider,
  data: Partial<Query<T>>,
): Promise<Response<T>> {
  return (
    await axios.post<Response<T>>(
      `http://${path.join(`localhost:${port}`, apiPath(endpoint))}`,
      data,
    )
  ).data;
}

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

describe('stating the server', () => {
  it('starts succesfully', async () => {
    expect(await server.start(port)).toBeTruthy();
    // Clear the testing database so tests are run on a clean slate
    await models.User.destroy({
      where: {},
    });
  });
});

describe('createAccount', () => {
  it('creates an account directly', async () => {
    // Normal case - All the required information is present
    // 1 - test output directly
    const res = await server.createAccount(credentials1);
    expect(res.data).toHaveProperty('id');
    expect(res.error).toBeUndefined();
    // 2 - check the database
    const query = await User.findAndCountAll({
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
    const query = await User.findAndCountAll({
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
    const query = await User.findAndCountAll({
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

describe('signIn', () => {
  it('signs in directly', async () => {
    // Normal case - All the required information is present & password is correct
    // Uses the same credentials as the account created in the previous section
    const res = await server.signIn(credentials1);
    expect(res.data).toHaveProperty('id');
    expect(res.data).toHaveProperty('token');
    expect(res.error).toBeUndefined();
    // Make sure the token is correct
    if (res.data && res.data.token) {
      const user = await token.validate(res.data.token, async (id) => {
        const res2 = await User.findOne({
          where: {
            id,
          },
        });
        if (res2 !== null) {
          return res2.toJSON();
        }
        return {};
      });
      expect(user).not.toBeNull();
      expect(user).not.toBeFalsy();
    }
  });
});

describe('createPost', () => {});

// TODO: change username/password, forgot password, delete entire account
// TODO: use mocks
