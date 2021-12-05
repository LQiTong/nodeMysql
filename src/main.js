import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import {
  fetchGet,
  fetchPost,
  fetchPatch,
  fetchPut,
  fetchDelete
} from '@/utils/request'

Vue.config.productionTip = false
Vue.use(ElementUI)
// Vue.prototype.$echarts = echarts
Vue.prototype.$get = fetchGet
Vue.prototype.$post = fetchPost
Vue.prototype.$patch = fetchPatch
Vue.prototype.$put = fetchPut
Vue.prototype.$del = fetchDelete
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')