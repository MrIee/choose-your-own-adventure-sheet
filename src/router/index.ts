import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AdventureSheet from '../containers/AdventureSheet.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: AdventureSheet,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
