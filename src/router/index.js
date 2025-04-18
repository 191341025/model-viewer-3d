import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import ModelList from '../views/ModelList.vue'
import IronMan from '../views/IronManModel.vue'
import Rocket from '../views/RocketModel.vue'
import Car from '../views/CarModel.vue'
import ModelDetail from '../views/ModelDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  {
    path: '/models',
    name: 'ModelList',
    component: ModelList
  },
  {
    path: '/models/rocket',
    name: 'RocketModel',
    component: Rocket
  },
  {
    path: '/models/ironman',
    name: 'IronManModel',
    component: IronMan
  },
  {
    path: '/models/car',
    name: 'CarModel',
    component: Car
  },
  {
    path: '/model-detail',
    name: 'ModelDetail',
    component: ModelDetail
  }
  
]

const router = createRouter({
  history: __IS_GHPAGES__
    ? createWebHashHistory('/model-viewer-3d/')
    : createWebHistory('/model-viewer-3d/'),
  routes
})
export default router
