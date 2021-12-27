/**
 * @file Frontend entry point.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import './bootstrap';
import App from './App';
import routes from './routes';
import vuetify from './vuetify';

new Vue({
  render: (h) => h(App),
  router: new VueRouter({
    routes,
  }),
  vuetify,
}).$mount('#app');
