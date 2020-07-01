import Vue from 'vue';
import VueRouter from 'vue-router';
import 'vue-tsx-support/enable-check';
import App from './App';
import Home from './views/Home';
import './registerServiceWorker';

Vue.use(VueRouter);

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
      {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ './views/About'),
      },
    ],
  }),
  render: (h) => h(App),
}).$mount('#app');
