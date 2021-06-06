import dotenv from 'dotenv';
import path from 'path';
import Server from './Server';

dotenv.config();

/**
 * Main Server startup process
 */
async function main() {
  // TODO: change port for deployment
  const { env } = process;
  if (env.authKey === undefined) {
    throw new Error('No authKey found');
  } else {
    const server = new Server(env.authKey, path.join(__dirname, 'media'));
    // TODO: change to production database
    await server.connect(
      env.PGUSER as string,
      env.PGPASSWORD as string,
      env.PGHOST as string,
      env.PGPORT as string,
      env.PGDATABASE as string,
    );
    await server.start(3000);
  }
}

main();
