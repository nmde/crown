import PasswordValidator from 'password-validator';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import Styled from '../Styled';
import background from '../assets/background.jpg';
import ErrorDialog from '../components/ErrorDialog';
import translations from '../translations';
import store from '../store';

// TODO: translations
// TODO: schema for translations
const t = translations['en-US'];
const { errors } = t;
const { USERNAME, PASSWORD } = errors;

/**
 * Check that a form field is not empty, and displays an error if it is
 * @param value Value supplied by v-text-field
 */
function required(value: string) {
  return () => value !== '' || errors.EMPTY_FIELD;
}

type Classes = 'container' | 'row';

/**
 * The login/signup page
 */
@Component
export default class Login extends Styled<Classes> {
  private get baseNotValid() {
    return !this.usernameIsValid || !this.passwordIsValid;
  }

  private get emailIsValid() {
    let valid = true;
    this.passwordRules.forEach((rule) => {
      valid = valid && rule(this.form.password) === true;
    });
    return valid;
  }

  private get emailRules() {
    return [
      required(this.form.email),
      (i: string) => /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        i,
      ) || errors.EMAIL,
    ];
  }

  private error = '';

  private form = {
    email: '',
    password: '',
    username: '',
  };

  private loading = false;

  private get passwordIsValid() {
    let valid = true;
    this.passwordRules.forEach((rule) => {
      valid = valid && rule(this.form.password) === true;
    });
    return valid;
  }

  private get passwordRules() {
    const { form } = this;
    return [
      required(form.password),
      (i: string) => new PasswordValidator().has().uppercase(3).validate(i) || PASSWORD.UPPERCASE,
      (i: string) => new PasswordValidator().has().lowercase(3).validate(i) || PASSWORD.LOWERCASE,
      (i: string) => new PasswordValidator().has().digits(2).validate(i) || PASSWORD.DIGITS,
      (i: string) => new PasswordValidator().has().symbols(1).validate(i) || PASSWORD.SYMBOLS,
      (i: string) => new PasswordValidator().has().not().oneOf([form.username])
        .validate(i) || PASSWORD.USERNAME,
    ];
  }

  private get usernameIsValid() {
    let valid = true;
    this.usernameRules.forEach((rule) => {
      valid = valid && rule(this.form.username) === true;
    });
    return valid;
  }

  private get usernameRules() {
    return [
      required(this.form.username),
      (i: string) => i.length >= 4 || USERNAME.LENGTH,
      (i: string) => new PasswordValidator().has().letters(1).validate(i) || USERNAME.LETTERS,
      (i: string) => new PasswordValidator()
        .has()
        .not(/[^A-Za-z0-9\-~_]/)
        .validate(i) || USERNAME.CHARACTERS,
    ];
  }

  public constructor() {
    super({
      container: {
        background: `url(${background}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        height: '100%',
      },
      row: {
        height: '100%',
      },
    });
  }

  public render(): VNode {
    return (
      <v-container class={this.c('container')} fluid>
        <v-row align="center" class={this.c('row')} justify="center">
          <v-col cols={12} sm={10} md={8} lg={6}>
            <v-card>
              <v-card-title class="h3 font-italic text-center">{t.headers.JOIN}</v-card-title>
              <v-tabs grow>
                <v-tab href="#signin">{t.headers.SIGNIN}</v-tab>
                <v-tab-item value="signin">
                  <v-card-text>
                    <v-text-field
                      label={t.labels.USERNAME}
                      vModel={this.form.username}
                      rules={this.usernameRules}
                    />
                    <v-text-field
                      label={t.labels.PASSWORD}
                      type="password"
                      vModel={this.form.password}
                      rules={this.passwordRules}
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      block
                      color="primary"
                      disabled={this.baseNotValid}
                      loading={this.loading}
                      onClick={async () => {
                        this.loading = true;
                        try {
                          await store.signIn({
                            username: this.form.username,
                            password: this.form.password,
                          });
                          this.$router.back();
                        } catch (err) {
                          this.loading = false;
                          switch (err.response.status) {
                            case 400:
                              this.error = t.errors.INVALID_CREDENTIALS;
                              break;
                            default:
                              this.error = t.errors.GENERIC;
                          }
                        }
                      }}
                    >
                      {t.btn.SIGNIN}
                    </v-btn>
                  </v-card-actions>
                </v-tab-item>
                <v-tab href="#signup">{t.headers.SIGNUP}</v-tab>
                <v-tab-item value="signup">
                  <v-card-text>
                    <v-text-field
                      label={t.labels.USERNAME}
                      vModel={this.form.username}
                      rules={this.usernameRules}
                    />
                    <v-text-field
                      label={t.labels.PASSWORD}
                      type="password"
                      vModel={this.form.password}
                      rules={this.passwordRules}
                    />
                    <v-text-field
                      label={t.labels.EMAIL}
                      vModel={this.form.email}
                      rules={this.emailRules}
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      block
                      color="primary"
                      loading={this.loading}
                      disabled={(() => this.baseNotValid || !this.emailIsValid)()}
                      onClick={async () => {
                        this.loading = true;
                        try {
                          await store.createAccount({
                            username: this.form.username,
                            password: this.form.password,
                            email: this.form.email,
                          });
                          // TODO: welcome message, verify email
                          this.$router.back();
                        } catch (err) {
                          this.loading = false;
                          switch (err.response.status) {
                            case 409:
                              this.error = t.errors.USERNAME.TAKEN;
                              break;
                            default:
                              this.error = t.errors.GENERIC;
                          }
                        }
                      }}
                    >
                      {t.btn.SIGNUP}
                    </v-btn>
                  </v-card-actions>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-col>
        </v-row>
        <ErrorDialog header={t.headers.SIGNIN_ERROR} message={this.error} />
      </v-container>
    );
  }
}
