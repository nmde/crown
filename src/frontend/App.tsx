import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import t from './translations/en-US.json';
import store from './store';

/**
 * The main app component - Contains all global logic & UI
 */
@Component
export default class App extends Vue {
  private nav = '';

  public render(): VNode {
    return (
      <v-app>
        {(() => {
          if (store.token === undefined) {
            return (
              <v-app-bar app color="primary">
                <v-app-bar-title>{t.msg.SIGNED_OUT}</v-app-bar-title>
                <v-spacer />
                <v-btn to="/login">
                  {t.btn.SIGNIN}
                </v-btn>
              </v-app-bar>
            );
          }
          return null;
        })()}
        <v-main>
          <router-view />
        </v-main>
        <v-bottom-navigation app color="primary" grow shift vModel={this.nav}>
          <v-btn to="/" value="home">
            <span>{t.headers.HOME}</span>
            <v-icon>home</v-icon>
          </v-btn>
          <v-btn to="/categories" value="categories">
            <span>{t.headers.CATEGORIES}</span>
            <v-icon>category</v-icon>
          </v-btn>
          <v-btn to="/explore" value="explore">
            <span>{t.headers.EXPLORE}</span>
            <v-icon>explore</v-icon>
          </v-btn>
          <v-btn to="/account" value="account">
            <span>{t.headers.ACCOUNT}</span>
            <v-icon>account_circle</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-app>
    );
  }
}
