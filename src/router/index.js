import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  {
    path: '/models',
    name: 'ModelList',
    component: () => import('../views/ModelList.vue')
  },
  {
    path: '/models/rocket',
    name: 'RocketModel',
    component: () => import('../views/RocketModel.vue')
  },
  {
    path: '/models/ironman',
    name: 'IronManModel',
    component: () => import('../views/IronManModel.vue')
  },
  {
    path: '/models/car',
    name: 'CarModel',
    component: () => import('../views/CarModel.vue')
  }
  
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
