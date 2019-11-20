import Vue from 'vue'
import Router from 'vue-router'

// Views
import Home from './views/Home.vue'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})