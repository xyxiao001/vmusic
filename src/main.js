import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './components/App'
import VueResource from 'vue-resource'

import Dashboard from './view/Dashboard'

Vue.use(VueRouter)
Vue.use(VueResource)

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  // mode: 'history',
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: Dashboard },
    { path: '*', component: Dashboard }
  ]
})

new Vue({
  router,
  ...App
}).$mount('#app')
