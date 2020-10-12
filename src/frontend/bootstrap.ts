/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import Vue from 'vue';
import VueDarkMode from '@vue-a11y/dark-mode';
import VueMoment from 'vue-moment';
import VuePlyr from 'vue-plyr';

// Install & configure libraries
Vue.use(VueDarkMode);
Vue.use(VueMoment);
Vue.use(VuePlyr);

// The following will only be run in development mode
// This allows us to use tools while building the app without giving users access to them
if (process.env.NODE_ENV === 'development') {
  // Libraries loaded in this section won't be included in the bundle
  const VueAxe = require('vue-axe').default;
  Vue.use(VueAxe);
}
