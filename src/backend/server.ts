import express from 'express';
import path from 'path';

export default class Server {
  private app = express();

  /**
   * Starts the server
   * @param port The port to run the server on (defaults to 3000)
   */
  public start(port = 3000): Promise<number> {
    return new Promise((resolve) => {
      const { app } = this;
      app.use(express.static(path.resolve(__dirname, '..', 'dist')));

      // Starts the server on the specified port
      app.listen(port, () => {
        resolve(port);
      });
    });
  }
}
