import dotenv from 'dotenv';
import path from 'path';
import Server from './Server';

dotenv.config();

// Starts the central server
// TODO: change port for deployment
const authKey = process.env.AUTHKEY;
if (authKey === undefined) {
  throw new Error('No authKey found');
} else {
  new Server(authKey, path.join(__dirname, 'media'))
    .start(3000)
    .then((port) => {
      console.log(`Server running on port ${port}`);
    })
    .catch((err) => {
      console.error(err);
    });
}
