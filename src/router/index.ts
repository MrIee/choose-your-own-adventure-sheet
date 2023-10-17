import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AdventureSheet from '../containers/AdventureSheet.vue';
import About from '../containers/About.vue';
import Rules from '../containers/Rules.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: AdventureSheet,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/rules',
    name: 'rules',
    component: Rules,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
