import Vue from 'vue'
import Router from 'vue-router'
import OverAll from '@/components/OverAll'
import LocalLan from '@/components/LocalLan'
import Login from '@/components/Login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/overAll',
      name: '进度',
      component: OverAll
    },
    {
      path: '/localLan',
      name: '收入',
      component: LocalLan
    }
  ]
})
