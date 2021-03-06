// 同步操作状态
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_SONGS] (state, songs) {
    state.songs = songs
  },
  [types.SET_PLAY_STATE] (state, flag) {
    state.playState = flag
  },
  [types.SET_FULLSCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_SQUENCE_LIST] (state, playlist) {
    state.sequencelist = playlist
  },
  [types.SET_PLAY_LIST] (state, playlist) {
    state.playlist = playlist
  },
  [types.SET_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  [types.SET_SEARCH_PLAY] (state, play) {
    state.searchPlay = play
  }
}
export default mutations
