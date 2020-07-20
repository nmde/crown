import Vue from 'vue';
import VueRouter from 'vue-router';
import 'vue-tsx-support/enable-check';
import Vuetify from 'vuetify';
import App from './App';
import Home from './views/Home';
import './boostrap';
import './registerServiceWorker';

const container = document.createElement('div');
container.id = 'app';
document.body.appendChild(container);

new Vue({
  router: new VueRouter({
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      }, {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ './views/Login'),
      },
    ],
  }),
  render: (h) => h(App),
  vuetify: new Vuetify(),
}).$mount('#app');
