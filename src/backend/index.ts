import path from 'path';
import Server from './server';

new Server(path.join(__dirname, 'database.sqlite'))
  .start()
  .then((port) => {
    console.log(`Server running on port ${port}`);
  })
  .catch((err) => {
    console.error(err);
  });
