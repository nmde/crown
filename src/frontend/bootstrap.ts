/**
 * @file Installs libraries.
 */
import Vue from 'vue';
import VueAxe from 'vue-axe';
import VueBus from 'vue-bus';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
Vue.use(VueBus);
// Vue.use(VueAxe);
Vue.use(VueRouter);
