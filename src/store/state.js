import {playMode} from '../common/js/config'

// 存放需要全局管理的数据
const state = {
  // 歌手选项卡点击的歌手
  singer: {},
  // music-list下面的songs
  songs: [],
  playState: false,
  fullScreen: false,
  playlist: [], //
  sequencelist: [], // 这是顺序列表
  mode: playMode.sequence,
  currentIndex: -1, // 当前播放歌曲在sequence中的索引
  searchHistory: [] // 搜索历史记录
}
export default state
