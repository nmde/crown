import JSCookie from 'js-cookie';
import { Observer } from 'mobx-vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import translations from '../translations';
import store from '../store';

// TODO: translations
const t = translations['en-US'];

function required(value: string) {
  return () => value !== '' || t.errors.EMPTY_FIELD;
}

@Observer
@Component
export default class Login extends Vue {
  private dialog = false;

  private error?: string;

  private form = {
    email: '',
    password: '',
    username: '',
  };

  private loading = false;

  private password2 = '';

  private get passwordsMatch() {
    return this.form.password === this.password2;
  }

  public render(): VNode {
    return (
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-tabs backrgound-color="primary" class="elevation-2" grow>
              <v-tab href="#login">{t.headers.SIGNIN}</v-tab>
              <v-tab-item value="login">
                <v-card>
                  <v-card-text>
                    <v-text-field
                      label={t.labels.USERNAME}
                      vModel={this.form.username}
                      rules={[required(this.form.username)]}
                    />
                    <v-text-field
                      label={t.labels.PASSWORD}
                      type="password"
                      vModel={this.form.password}
                      rules={[required(this.form.password)]}
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      disabled={this.form.username === '' || this.form.password === ''}
                      loading={this.loading}
                      onClick={async () => {
                        this.loading = true;
                        try {
                          JSCookie.set(
                            'token',
                            (
                              await store.signIn({
                                username: this.form.username,
                                password: this.form.password,
                              })
                            ).token,
                          );
                        } catch (err) {
                          this.loading = false;
                          this.dialog = true;
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
                      {t.labels.SUBMIT}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab href="#signup">{t.headers.SIGNUP}</v-tab>
              <v-tab-item value="signup">
                <v-card>
                  <v-card-text>
                    <v-text-field
                      label={t.labels.USERNAME}
                      vModel={this.form.username}
                      rules={[required(this.form.username)]}
                    />
                    <v-text-field
                      label={t.labels.PASSWORD}
                      type="password"
                      vModel={this.form.password}
                      rules={[required(this.form.password)]}
                    />
                    <v-text-field
                      label={t.labels.CONFIRM_PASSWORD}
                      type="password"
                      vModel={this.password2}
                      rules={[
                        required(this.password2),
                        () => this.passwordsMatch || t.errors.PASSWORD_MISMATCH,
                      ]}
                    />
                    <v-text-field
                      label={t.labels.EMAIL}
                      vModel={this.form.email}
                      rules={[required(this.form.email)]}
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      loading={this.loading}
                      disabled={
                        this.form.username === ''
                        || this.form.password === ''
                        || !this.passwordsMatch
                        || this.form.email === ''
                      }
                      onClick={async () => {
                        this.loading = true;
                        await store.createAccount({
                          username: this.form.username,
                          password: this.form.password,
                          email: this.form.email,
                        });
                        /*
                        if (query.error === undefined) {
                          this.$router.back();
                        } else {
                          this.loading = false;
                          this.dialog = true;
                          this.error = query.error;
                          console.log(query.error);
                          /*
                          if (query.error?.name === 'SequelizeUniqueConstraintError') {
                            this.error = new Error('Username is unavaiable!');
                          }
                          *
                        }
                        */
                      }}
                    >
                      Submit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
        <v-dialog max-width={500} vModel={this.dialog}>
          <v-card>
            <v-card-title>Something went wrong</v-card-title>
            <v-card-text>
              Sorry, something went wrong with your request.
              <div class="overline error--text">{this.error}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                onClick={() => {
                  this.dialog = false;
                }}
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    );
  }
}
