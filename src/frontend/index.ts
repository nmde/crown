import Vue from 'vue';
import VueAxe from 'vue-axe';
import VueRouter from 'vue-router';
import './bootstrap';
import App from './App';
import routes from './routes';
import vuetify from './vuetify.js';

// Install & configure libraries
Vue.use(VueAxe);
Vue.use(VueRouter);

new Vue({
  render: (h) => h(App),
  router: new VueRouter({
    routes,
  }),
  vuetify,
}).$mount('#app');
