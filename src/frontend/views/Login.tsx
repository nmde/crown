import { Observer } from 'mobx-vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import Store from '../store';

@Observer
@Component
export default class Login extends Vue {
  private dialog = false;

  private displayName = '';

  private error?: Error;

  private loading = false;

  private password = '';

  private password2 = '';

  private store = new Store();

  private username = '';

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
                    <v-text-field label="Username" vModel={this.username} />
                    <v-text-field label="Password" type="password" vModel={this.password} />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="primary" loading={this.loading} onClick={async () => {
                      this.loading = true;
                      const query = await this.store.client.login({
                        username: this.username,
                        password: this.password,
                      });
                      if (query.success) {
                        this.$router.back();
                      } else {
                        console.log(query);
                        this.loading = false;
                        this.dialog = true;
                        this.error = query.error;
                      }
                    }}>
                      Submit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-tab-item>
              <v-tab href="#signup">Sign Up</v-tab>
              <v-tab-item value="signup">
                <v-card>
                  <v-card-text>
                    <v-text-field label="Username" vModel={this.username} />
                    <v-text-field label="Display Name" vModel={this.displayName} />
                    <v-text-field label="Password" type="password" vModel={this.password} />
                    <v-text-field
                      label="Confirm Password"
                      type="password"
                      vModel={this.password2}
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      loading={this.loading}
                      onClick={async () => {
                        // TODO form validation
                        this.loading = true;
                        const query = await this.store.client.createUser({
                          displayName: this.displayName,
                          username: this.username,
                          password: this.password,
                        });
                        if (query.success) {
                          this.$router.back();
                        } else {
                          this.loading = false;
                          this.dialog = true;
                          this.error = query.error;
                          if (query.error?.name === 'SequelizeUniqueConstraintError') {
                            this.error = new Error('Username is unavaiable!');
                          }
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
              <span class="overline error--text">{this.error?.message}</span>
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
