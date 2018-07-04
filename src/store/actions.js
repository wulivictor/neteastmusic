// 异步操作 或者是对mutation的封装
import * as types from './mutation-types'
// 提交多个数据需要用到action
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAY_LIST, list)

  commit(types.SET_SQUENCE_LIST, list)

  commit(types.SET_CURRENT_INDEX, index)

  commit(types.SET_FULLSCREEN, true)

  commit(types.SET_PLAY_STATE, true)
}
