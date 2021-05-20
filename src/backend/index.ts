import dotenv from 'dotenv';
import path from 'path';
import Server from './Server';

dotenv.config();

/**
 * Main Server startup process
 */
async function main() {
  // TODO: change port for deployment
  const authKey = process.env.AUTHKEY;
  if (authKey === undefined) {
    throw new Error('No authKey found');
  } else {
    const server = new Server(authKey, path.join(__dirname, 'media'));
    // TODO: change to production database
    await server.connect(
      'postgres',
      process.env.PGPASSWORD as string,
      'localhost',
      '5432',
      'crown-test',
    );
    await server.start(3000);
  }
}

main();
