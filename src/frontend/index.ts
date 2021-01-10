import { Renderer } from 'fela-vue';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import VueAxe from 'vue-axe';
import VueRouter from 'vue-router';
import App from './App';
import routes from './routes';

// Install & configure libraries
Vue.mixin(new Renderer().mixin);
Vue.use(VueAxe);
Vue.use(Vuetify);
Vue.use(VueRouter);

new Vue({
  render: (h) => h(App),
  router: new VueRouter({
    routes,
  }),
  vuetify: new Vuetify({}),
}).$mount('#app');
