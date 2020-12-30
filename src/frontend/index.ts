import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import VueRouter from 'vue-router';
import App from './App';
import routes from './routes';

// Install & configure libraries
Vue.use(Vuetify);
Vue.use(VueRouter);

// The following will only be run in development mode
// This allows us to use tools while building the app without giving users access to them
if (process.env.NODE_ENV === 'development') {
  // Libraries loaded in this section won't be included in the bundle
  /* eslint-disable global-require */
  /* eslint-disable @typescript-eslint/no-var-requires */
  /* eslint-disable import/no-extraneous-dependencies */
  const VueAxe = require('vue-axe').default;
  Vue.use(VueAxe);
}

new Vue({
  render: (h) => h(App),
  router: new VueRouter({
    routes,
  }),
  vuetify: new Vuetify({}),
}).$mount('#app');
