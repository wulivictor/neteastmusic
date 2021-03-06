// 取数据 和state不一样的是 ，getter可以对state的数据进行处理，例如对数据进行操作

import state from './state'

export const singer = state => state.singer

export const songs = state => state.songs

export const playState = state => state.playState

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequencelist = state => state.sequencelist

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const searchHistory = state => state.searchHistory

export const searchPlay = state => state.searchPlay

// 通过播放列表和当前播放索引获取当前播放的歌曲
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
