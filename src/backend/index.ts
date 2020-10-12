import Server from './server';

// Starts the central server
// TODO: change port for deployment
new Server()
  .start()
  .then((port) => {
    console.log(`Server running on port ${port}`);
  })
  .catch((err) => {
    console.error(err);
  });
