import { createRouter, createWebHashHistory } from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import MemoryLaneView from '@/views/MemoryLaneView.vue'
import CakeView from '@/views/CakeView.vue'
import LetterView from '@/views/LetterView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/memory-lane',
      name: 'memory-lane',
      component: MemoryLaneView,
    },
    {
      path: '/cake',
      name: 'cake',
      component: CakeView,
    },
    {
      path: '/letter',
      name: 'letter',
      component: LetterView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
