import { createRouter, createWebHashHistory } from 'vue-router';
import Flashcard from '../views/Flashcard.vue';
import Index from '../views/Index.vue';

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    beforeEnter: (to, from, next) => {
      // When returning to root, clear specific session data
      sessionStorage.removeItem('indexArray');
      next();
    },
  },
  {
    path: '/:type/:groupIndex/:wordIndex/:random',
    name: 'Flashcard',
    component: Flashcard,
  },
];

const router = createRouter({
  history: createWebHashHistory('/flashcard/'),
  routes,
});

export default router;
