/**
 * @file ViewComponent class.
 */
import { AxiosError } from 'axios';
import { IUser } from '../../types';
import store from '../store';
import { Styles } from '../styles/makeStyles';
import translations from '../translations';
import APIError from './APIError';
import Styled from './Styled';

/**
 * Utility class for view component.
 */
export default class ViewComponent<T extends Styles<string>> extends Styled<T> {
  /** The current selected language. */
  private lang: keyof typeof translations = 'en-US';

  /** View loading state. */
  protected loading = false;

  /**
   * Gets UI messages in the currently selected .
   *
   * @returns {Record<string, string>} The messages.
   */
  protected get messages(): typeof translations['en-US'] {
    return translations[this.lang];
  }

  /**
   * Utility for interacting with the API.
   *
   * @param {Function} method The API method.
   * @param {Function} onSuccess Called if the API query is succesfull.
   * @param {Record<number, string>} errorMessages Error messages for response status codes.
   */
  protected async apiCall(
    method: () => Promise<void>,
    onSuccess: () => void,
    errorMessages?: Record<number, string>,
  ): Promise<void> {
    this.loading = true;
    try {
      await method();
      // Don't forward onSuccess errors to the error handler
      try {
        onSuccess();
      } catch (err) {
        console.error(err);
      }
    } catch (e) {
      console.error(e);
      const err = e as AxiosError;
      if (errorMessages !== undefined) {
        if (err.message === 'Network Error') {
          this.$bus.emit(
            'error',
            new APIError(this.messages.headers.HOME_ERROR, this.messages.errors.NETWORK, -1),
          );
        } else if (err.response !== undefined && errorMessages[err.response.status] !== undefined) {
          this.$bus.emit(
            'error',
            new APIError(
              this.messages.headers.HOME_ERROR,
              errorMessages[err.response.status],
              err.response.status,
            ),
          );
        } else {
          this.$bus.emit(
            'error',
            new APIError(
              this.messages.headers.HOME_ERROR,
              this.messages.errors.GENERIC,
              err.response?.status || -1,
            ),
          );
        }
      }
    }
    this.loading = false;
  }

  /**
   * Ensures store.currentUser exists and is correct.
   *
   * @returns {boolean} If the user is signed in.
   */
  protected async getCurrentUser(): Promise<boolean> {
    const { token } = store;
    let re = false;
    if (token !== undefined) {
      await this.apiCall(
        async () => {
          await store.authenticate();
        },
        () => {
          re = true;
        },
      );
    }
    return re;
  }

  /**
   * Check that a form field is not empty, and displays an error if it is.
   *
   * @param {string} value Value supplied by v-text-field.
   * @returns {Function} The validator function.
   */
  protected required(value: string) {
    return (): string | boolean => value !== '' || this.messages.errors.EMPTY_FIELD;
  }

  /**
   * Safely gets the current user.
   *
   * @returns {IUser} The current user.
   */
  protected async getUser(): Promise<IUser | null> {
    let user: IUser | null = null;
    await this.getCurrentUser();
    await this.apiCall(
      async () => {
        if (store.currentUser) {
          user = (await store.getUser({
            username: store.currentUser.username as string,
          })) as IUser;
        }
      },
      () => {},
      {},
    );
    return user;
  }
}
