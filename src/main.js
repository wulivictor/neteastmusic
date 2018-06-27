import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import 'common/style/index.styl'
import vueresource from 'vue-resource'
import lazyload from 'vue-lazyload'
import axios from 'axios'
Vue.config.productionTip = false
fastclick.attach(document.body)

/* eslint-disable no-new */
// 设置懒加载
Vue.use(lazyload, {
  loading: require('common/image/default.png')
})
// 引入vue-resource
Vue.use(vueresource)
// 配置路由
router.push('/recommend')
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// 修改vue原型链
Vue.prototype.$ajax = axios
