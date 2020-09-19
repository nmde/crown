import { Observer } from 'mobx-vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import Store from '../store';
import UserData from '../../types/UserData';

function required(value: string) {
  return () => value !== '' || 'Field cannot be empty';
}

@Observer
@Component
export default class Login extends Vue {
  private dialog = false;

  private displayName = '';

  private error?: string;

  private form = {
    password: '',
    username: '',
  };

  private get isValid() {
    let valid = true;
    Object.values(this.form).forEach((val) => {
      valid = valid && val !== '';
    });
    return valid;
  }

  private loading = false;

  private password2 = '';

  private get passwordsMatch() {
    return this.form.password === this.password2;
  }

  private store = new Store();

  public render(): VNode {
    return (
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-tabs backrgound-color="primary" class="elevation-2" grow>
              <v-tab href="#login">Sign In</v-tab>
              <v-tab-item value="login">
                <v-card>
                  <v-card-text>
                    <v-text-field
                      label="Username"
                      vModel={this.form.username}
                      rules={[required(this.form.username)]}
                    />
                    <v-text-field
                      label="Password"
                      type="password"
                      vModel={this.form.password}
                      rules={[required(this.form.password)]}
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      disabled={!this.isValid}
                      loading={this.loading}
                      onClick={async () => {
                        this.loading = true;
                        const query = await this.store.client.login({
                          username: this.form.username,
                          password: this.form.password,
                        });
                        if (query.success) {
                          this.store.setUser(query?.data as UserData);
                          this.$router.back();
                        } else {
                          console.log(query);
                          this.loading = false;
                          this.dialog = true;
                          this.error = query.error;
                        }
                      }}
                    >
                      Submit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab href="#signup">Sign Up</v-tab>
              <v-tab-item value="signup">
                <v-card>
                  <v-card-text>
                    <v-text-field
                      label="Username"
                      vModel={this.form.username}
                      rules={[required(this.form.username)]}
                    />
                    <v-text-field
                      label="Display Name"
                      vModel={this.displayName}
                      rules={[required(this.displayName)]}
                    />
                    <v-text-field
                      label="Password"
                      type="password"
                      vModel={this.form.password}
                      rules={[required(this.form.password)]}
                    />
                    <v-text-field
                      label="Confirm Password"
                      type="password"
                      vModel={this.password2}
                      rules={[
                        required(this.password2),
                        () => this.passwordsMatch || 'Passwords must match',
                      ]}
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      loading={this.loading}
                      disabled={!this.isValid || !this.passwordsMatch || this.displayName === ''}
                      onClick={async () => {
                        this.loading = true;
                        const query = await this.store.client.createUser({
                          displayName: this.displayName,
                          username: this.form.username,
                          password: this.form.password,
                        });
                        if (query.success) {
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
                          */
                        }
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
