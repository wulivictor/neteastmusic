import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'common/style/index.styl'
import vueresource from 'vue-resource'

Vue.config.productionTip = false
fastclick.attach(document.body)

/* eslint-disable no-new */

Vue.use(vueresource)
router.push({path: '/recommand'})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
