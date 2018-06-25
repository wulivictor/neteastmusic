import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getter from './getter'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger' // 修改vuex数据后会打印一条记录，vuex的小插件

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production' // 检测是否为生产工具

export default new Vuex.Store({
  actions,
  getter,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
