import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getter'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger' // 修改vuex数据后会打印一条记录，vuex的小插件

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production' // 检测是否为生产工具
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  // strict: debug, // 修改mutation的状态。不管是不是有mutation改变的，都会报错，便于调试
  plugins: debug ? [createLogger()] : []
})
