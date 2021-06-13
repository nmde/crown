import { Styles } from '../styles/makeStyles';
import translations from '../translations';
import Styled from './Styled';

/**
 * Utility class for view component
 */
export default class ViewComponent<T extends Styles<string>> extends Styled<T> {
  /** the current selected language */
  private lang: keyof typeof translations = 'en-US';

  /** view loading state */
  protected loading = false;

  /** the error message, if any */
  protected error = '';

  /**
   * Gets UI messages in the currently selected locale
   *
   * @returns {Record<string, string>} the messages
   */
  protected get messages(): typeof translations['en-US'] {
    return translations[this.lang];
  }

  /**
   * Utility for interacting with the API
   *
   * @param {Function} method the API method
   * @param {Function} onSuccess called if the API query is succesfull
   * @param {Record<number, string>} errorMessages error messages for possible response status codes
   */
  protected async apiCall(
    method: () => Promise<void>,
    onSuccess: () => void,
    errorMessages: Record<number, string>,
  ): Promise<void> {
    this.loading = true;
    try {
      await method();
      onSuccess();
    } catch (err) {
      if (err.message === 'Network Error') {
        this.error = this.messages.errors.NETWORK;
      } else if (err.response !== undefined && errorMessages[err.response.status] !== undefined) {
        this.error = errorMessages[err.response.status];
      } else {
        this.error = this.messages.errors.GENERIC;
      }
    }
    this.loading = false;
  }
}
