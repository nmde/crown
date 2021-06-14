import PasswordValidator from 'password-validator';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import ViewComponent from '../classes/ViewComponent';
import ErrorDialog from '../components/ErrorDialog';
import TextBtn from '../components/TextBtn';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({});

export type Props = {};

@Component
/**
 * The login/signup page
 */
export default class Login extends ViewComponent<typeof styles> implements Props {
  /** enables additional fields for creating a new account */
  private createMode = false;

  /** form data */
  private form: {
    displayName: string;
    email: string;
    password: string;
    username: string;
  } = {
    displayName: '',
    email: '',
    password: '',
    username: '',
  };

  /**
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * The error dialog header
   *
   * @returns {string} the header text
   */
  private get header() {
    if (this.createMode) {
      return this.messages.headers.SIGNUP;
    }
    return this.messages.headers.SIGNIN_ERROR;
  }

  /**
   * Checks if the base information is valid
   *
   * @returns {boolean} if the base information is valid
   */
  private get baseNotValid() {
    return !this.usernameIsValid || !this.passwordIsValid;
  }

  /**
   * Checks if the additional create account fields are valid
   *
   * @returns {boolean} if the create account fields are valid
   */
  private get extraNotValid() {
    return !this.emailIsValid || this.form.displayName.length === 0;
  }

  /**
   * Checks if the email is valid
   *
   * @returns {boolean} if the email is valid
   */
  private get emailIsValid() {
    let valid = true;
    this.emailRules.forEach((rule) => {
      valid = valid && rule(this.form.email) === true;
    });
    return valid;
  }

  /**
   * Rules for validating emails
   *
   * @returns {Function[]} validator functions for emails
   */
  private get emailRules() {
    return [
      this.required(this.form.email),
      (i: string) => /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        i,
      ) || this.messages.errors.EMAIL,
    ];
  }

  /**
   * Checks if the password is valid
   *
   * @returns {boolean} if the password is valid
   */
  private get passwordIsValid() {
    let valid = true;
    this.passwordRules.forEach((rule) => {
      valid = valid && rule(this.form.password) === true;
    });
    return valid;
  }

  /**
   * Rules for validating passwords
   *
   * @returns {Function[]} validator functions for passwords
   */
  private get passwordRules() {
    const { form } = this;
    return [
      this.required(form.password),
      (i: string) => new PasswordValidator().has().letters(3).validate(i)
        || this.messages.errors.PASSWORD.LETTERS,
      (i: string) => new PasswordValidator().has().digits(2).validate(i)
        || this.messages.errors.PASSWORD.DIGITS,
      (i: string) => new PasswordValidator().has().symbols(1).validate(i)
        || this.messages.errors.PASSWORD.SYMBOLS,
      (i: string) => new PasswordValidator().has().not().oneOf([form.username])
        .validate(i)
        || this.messages.errors.PASSWORD.USERNAME,
    ];
  }

  /**
   * Checks if the username is valid
   *
   * @returns {boolean} if the username is valid
   */
  private get usernameIsValid() {
    let valid = true;
    this.usernameRules.forEach((rule) => {
      valid = valid && rule(this.form.username) === true;
    });
    return valid;
  }

  /**
   * Rules for checking the validity of usernames
   *
   * @returns {Function[]} validator functions for usernames
   */
  private get usernameRules() {
    return [
      this.required(this.form.username),
      (i: string) => i.length >= 4 || this.messages.errors.USERNAME.LENGTH,
      (i: string) => new PasswordValidator().has().letters(1).validate(i)
        || this.messages.errors.USERNAME.LETTERS,
      (i: string) => new PasswordValidator()
        .has()
        .not(/[^A-Za-z0-9\-~_]/)
        .validate(i) || this.messages.errors.USERNAME.CHARACTERS,
    ];
  }

  /**
   * Check that a form field is not empty, and displays an error if it is
   *
   * @param {string} value Value supplied by v-text-field
   * @returns {Function} the validator function
   */
  private required(value: string) {
    return () => value !== '' || this.messages.errors.EMPTY_FIELD;
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <v-card>
        <v-card-title>{this.messages.headers.SIGNIN}</v-card-title>
        <v-card-text>
          <v-text-field
            label={this.messages.labels.USERNAME}
            prepend-icon="account_circle"
            rules={this.usernameRules}
            vModel={this.form.username}
          />
          <v-text-field
            label={this.messages.labels.PASSWORD}
            prepend-icon="lock"
            rules={this.passwordRules}
            type="password"
            vModel={this.form.password}
          />
          {(() => {
            if (this.createMode) {
              return (
                <div>
                  <v-text-field
                    label={this.messages.labels.EMAIL}
                    prepend-icon="email"
                    rules={this.emailRules}
                    vModel={this.form.email}
                  />
                  <v-text-field
                    label={this.messages.labels.DISPLAY_NAME}
                    prepend-icon="face"
                    rules={[this.required(this.form.displayName)]}
                    vModel={this.form.displayName}
                  />
                  <v-btn
                    block
                    color="primary"
                    disabled={this.baseNotValid || this.extraNotValid }
                    loading={this.loading}
                    onClick={async () => {
                      await this.apiCall(
                        async () => {
                          await store.createAccount({
                            displayName: this.form.displayName,
                            email: this.form.email,
                            password: this.form.password,
                            username: this.form.username,
                          });
                        },
                        () => {
                          // TODO: welcome page
                          this.$router.back();
                        },
                        {
                          409: this.messages.errors.CONFLICT,
                        },
                      );
                    }}
                  >
                    {this.messages.btn.SIGNUP}
                  </v-btn>
                  <TextBtn
                    text={this.messages.text.EXISTING_ACCOUNT}
                    onClick={() => {
                      this.createMode = false;
                    }}
                  />
                </div>
              );
            }
            return (
              <div>
                <v-btn
                  block
                  color="primary"
                  disabled={this.baseNotValid}
                  loading={this.loading}
                  onClick={async () => {
                    await this.apiCall(
                      async () => {
                        await store.signIn({
                          password: this.form.password,
                          username: this.form.username,
                        });
                      },
                      () => {
                        this.$router.back();
                      },
                      {
                        400: this.messages.errors.INVALID_CREDENTIALS,
                      },
                    );
                  }}
                >
                  {this.messages.btn.SIGNIN}
                </v-btn>
                <TextBtn
                  text={this.messages.text.CREATE_ACCOUNT}
                  onClick={() => {
                    this.createMode = true;
                  }}
                />
              </div>
            );
          })()}
        </v-card-text>
        <ErrorDialog header={this.header} message={this.error} />
      </v-card>
    );
  }
}
