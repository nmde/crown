/* eslint-disable no-console */
import dotenv from 'dotenv';
import path from 'path';
import Server from './Server';

dotenv.config();

const { env } = process;
if (env.authKey === undefined) {
  throw new Error('No authKey found');
} else {
  const server = new Server(env.authKey, path.join(__dirname, 'media'));
  // TODO: change to production database
  server
    .connect(
      env.PGUSER as string,
      env.PGPASSWORD as string,
      env.PGHOST as string,
      env.PGPORT as string,
      env.PGDATABASE as string,
    )
    .then(() => {
      server.start(env.PORT as string).then(() => {
        console.log(`Server started on port ${env.PORT}`);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}
