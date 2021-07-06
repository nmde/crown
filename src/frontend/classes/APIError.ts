/**
 * API call error
 */
export default class APIError extends Error {
  /** the error title */
  public title: string;

  /** the http status code */
  public status: number;

  /**
   * @constructs
   * @param {string} title the error header
   * @param {string} message the error message
   * @param {number} status the http status code
   */
  public constructor(title: string, message: string, status: number) {
    super(message);
    this.title = title;
    this.status = status;
  }
}
