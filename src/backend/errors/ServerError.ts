/**
 * An error that occurs while establishing a connection to the database
 */
export default class ServerError extends Error {
  /**
   * @param {string} message The error message
   */
  public constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
    this.message = message;
  }
}
