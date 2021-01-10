import { RouteConfig } from 'vue-router';
import Account from './views/Account';
import Categories from './views/CategoriesPage.vue';
import Explore from './views/Explore';
import Home from './views/Home';
import Login from './views/Login';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/account',
    component: Account,
  },
  {
    path: '/categories',
    component: Categories,
  },
  {
    path: '/explore',
    component: Explore,
  },
  {
    path: '/login',
    component: Login,
  },
];

export default routes;
