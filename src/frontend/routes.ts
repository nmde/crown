import { RouteConfig } from 'vue-router';
import Account from './views/Account';
// import Categories from './views/CategoriesPage.vue';
import Explore from './views/Explore';
import Home from './views/Home';
import Login from './views/Login';
import SinglePost from './views/SinglePost';

const routes: RouteConfig[] = [
  {
    component: Home,
    path: '/',
  },
  {
    component: Account,
    path: '/account',
  },
  /*
  {
    path: '/categories',
    component: Categories,
  },
  */
  {
    component: Explore,
    path: '/explore',
  },
  {
    component: Login,
    path: '/login',
  },
  {
    component: SinglePost,
    path: '/post/:id',
  },
];

export default routes;
