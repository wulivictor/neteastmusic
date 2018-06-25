import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import 'common/style/index.styl'
import vueresource from 'vue-resource'
import lazyload from 'vue-lazyload'

Vue.config.productionTip = false
fastclick.attach(document.body)

/* eslint-disable no-new */
Vue.use(lazyload, {
  loading: require('common/image/default.png')
})
Vue.use(vueresource)
router.push('/Recommend')
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
