/**
 * @file VueRouter routes.
 */
import { RouteConfig } from 'vue-router';
import Account from './views/Account';
import Categories from './views/Categories';
import Category from './views/Category';
import Explore from './views/Explore';
import Home from './views/Home';
import Login from './views/Login';
import Messages from './views/Messages';
import Profile from './views/Profile';
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
  {
    component: Categories,
    path: '/categories',
  },
  {
    component: Category,
    path: '/c/:category',
  },
  {
    component: Explore,
    path: '/explore',
  },
  {
    component: Login,
    path: '/login',
  },
  {
    component: Messages,
    path: '/messages',
  },
  {
    component: SinglePost,
    path: '/post/:id',
  },
  {
    component: Profile,
    path: '/@:username',
  },
];

export default routes;
