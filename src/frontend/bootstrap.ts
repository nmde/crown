import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import VueBus from 'vue-bus';
import VueSocketIO from 'vue-socket.io';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
Vue.use(VueBus);
Vue.use(
  new VueSocketIO({
    connection: '/socket',
  }),
);
