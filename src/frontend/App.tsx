import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';

/**
 * The main app component - Contains all global logic & UI
 */
@Component
export default class App extends Vue {
  private nav = 'home';

  public render(): VNode {
    return (
      <v-app>
        <v-main>
          <router-view />
        </v-main>
        <v-bottom-navigation app color="primary" grow shift vModel={this.nav}>
          <v-btn to="/" value="home">
            <span>Home</span>
            <v-icon>home</v-icon>
          </v-btn>
          <v-btn to="/categories" value="categories">
            <span>Categories</span>
            <v-icon>category</v-icon>
          </v-btn>
          <v-btn to="/explore" value="explore">
            <span>Explore</span>
            <v-icon>explore</v-icon>
          </v-btn>
          <v-btn to="/account" value="account">
            <span>My Account</span>
            <v-icon>account_circle</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-app>
    );
  }
}
