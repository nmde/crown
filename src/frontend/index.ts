import Vue from 'vue';
import VueRouter from 'vue-router';
import 'vue-tsx-support/enable-check';
import App from './App';
import Home from './views/Home';
import './boostrap';
import './registerServiceWorker';

const container = document.createElement('div');
container.id = 'app';
document.body.appendChild(container);

new Vue({
  router: new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
    ],
  }),
  render: (h) => h(App),
}).$mount('#app');
