// 同步操作状态
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_SONGS] (state, songs) {
    state.songs = songs
  }
}
export default mutations
