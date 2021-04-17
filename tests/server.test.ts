import dotenv from 'dotenv';
import { HttpError } from 'fastify-sensible/lib/httpError';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Server from '../src/backend/Server';
import models from '../src/backend/models';

dotenv.config();

const authKey = process.env.AUTHKEY as string;
const mediaDir = path.join(__dirname, 'media');
const server = new Server(authKey, mediaDir);

// ID and tokens are dynamically generated during tests
let userId: string;
let token: string;
let postId: string;

// Clean up before running tests
beforeAll(async () => {
  if (fs.existsSync(mediaDir)) {
    fs.rmdirSync(mediaDir);
  }
});

describe('constructing Server', () => {
  it('constructs Server', () => {
    expect(server).toBeDefined();
  });
  it('constructs Server in development mode', () => {
    process.env.NODE_ENV = 'development';
    const devServer = new Server(authKey, mediaDir);
    expect(devServer.devMode).toBeTruthy();
    delete process.env.NODE_ENV;
  });
});

describe('starting the server', () => {
  // Tests must run in this order so subsequent tests can use the database connection
  it('fails to connect to the database', async () => {
    try {
      await server.connect(
        'postgres',
        process.env.PGPASSWORD as string,
        'localhost',
        '5432',
        'foobar',
      );
    } catch (err) {
      expect(err.message).toMatch('Could not establish database connection.');
    }
  });
  it('connects to the test database', async () => {
    const database = await server.connect(
      'postgres',
      process.env.PGPASSWORD as string,
      'localhost',
      '5432',
      'crown-test',
    );
    expect(database).toBeDefined();
  });
  it('starts the server', async () => {
    await server.start(3000);
    expect(fs.existsSync(mediaDir)).toBeTruthy();
  });
  it('starts the server on an invalid port', async () => {
    try {
      await server.start(3000);
    } catch (err) {
      expect(err.message).toBeDefined();
    }
  });
});

describe('creating accounts', () => {
  it('creates an account', async () => {
    const user = await server.createAccount({
      displayName: 'John Smith',
      email: 'me@example.com',
      password: 'password',
      username: 'user123',
    });
    expect(user.id).toBeDefined();
  });
  it('creates an account with duplicate username', async () => {
    try {
      await server.createAccount({
        displayName: 'John Smith',
        email: 'me@example.com',
        password: 'password',
        username: 'user123',
      });
    } catch (err) {
      expect((err as HttpError).statusCode).toBe(409);
    }
  });
});

describe('signing in', () => {
  it('signs in', async () => {
    const user = await server.signIn({
      password: 'password',
      username: 'user123',
    });
    expect(user.token).toBeDefined();
    // Update the ID and token for other tests
    userId = user.id;
    token = user.token;
  });
  it('fails to sign in', async () => {
    try {
      await server.signIn({
        password: 'wrong_password',
        username: 'user123',
      });
    } catch (err) {
      expect((err as HttpError).statusCode).toBe(400);
    }
  });
});

describe('getting a user', () => {
  it('gets a user', async () => {
    const user = await server.getUser({
      id: userId,
    });
    expect(user.username).toBe('user123');
  });
  it('gets a user that does not exist', async () => {
    try {
      await server.getUser({
        id: uuidv4(),
      });
    } catch (err) {
      expect((err as HttpError).statusCode).toBe(400);
    }
  });
});

describe('creating posts', () => {
  it('creates a post', async () => {
    const post = await server.createPost({
      description: 'Test post',
      expires: new Date().toISOString(),
      media: '',
      token,
    });
    postId = post.id;
  });
  it('creates a post with an invalid token', async () => {
    try {
      await server.createPost({
        description: 'Test post',
        expires: new Date().toISOString(),
        media: '',
        token: uuidv4(),
      });
    } catch (err) {
      expect((err as HttpError).statusCode).toBe(401);
    }
  });
});

describe('getting posts', () => {
  it('gets a post', async () => {
    const post = await server.getPost({
      id: postId,
    });
    expect(post.author).toBe(userId);
  });
  it('gets a post that does not exist', async () => {
    try {
      await server.getPost({
        id: uuidv4(),
      });
    } catch (err) {
      expect((err as HttpError).statusCode).toBe(404);
    }
  });
});

describe('getting a feed', () => {
  it('gets author feed', async () => {
    const feed = await server.getFeed({
      author: userId,
    });
    expect(feed.length).toBe(1);
    expect(feed[0].author).toBe(userId);
  });
  it('gets an empty feed', async () => {
    try {
      await server.getFeed({});
    } catch (err) {
      expect((err as HttpError).statusCode).toBe(400);
    }
  });
});

// Shut down the server after tests have completed
afterAll(async () => {
  await server.stop();

  // Clear the test database so the next time tests run, they run on an empty slate
  await models.User.destroy({
    where: {},
  });
  await models.Post.destroy({
    where: {},
  });
});
