import { Observer } from 'mobx-vue';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import Store from '../store';

@Observer
@Component
export default class Login extends Vue {
  private displayName = '';

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
                    <v-btn color="primary">Submit</v-btn>
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
                      onClick={async () => {
                        await this.store.client.createUser({
                          displayName: this.displayName,
                          username: this.username,
                          password: this.password,
                        });
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
      </v-container>
    );
  }
}
