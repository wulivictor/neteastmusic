<template>
  <div class="singer" ref="singer">
    <listview :data="singer "> </listview>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from '../../api/getSingerList'
import {ERROR_OK} from '../../api/common'
import Singer from '../../common/js/singer.js'
import listview from '../../base/listview/listview.vue'
const HOT_NAME = '热门歌手'
const HOT_SINGER_LENGTH = 10
export default {
  data () {
    return {
      singer: []
    }
  },
  components: {
    listview
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      let that = this
      getSingerList().then((response) => {
        if (response.code === ERROR_OK) {
          let singerlist = that._normalizeable(response.data.list)
          this.singer = singerlist
        }
      })
    },
    _normalizeable (list) {
      let map = {}
      map.hot = {
        title: HOT_NAME,
        singers: []
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LENGTH) {
          let id = item.Fsinger_mid
          let name = item.Fsinger_name
          map.hot.singers.push(new Singer({id, name}))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            singers: []
          }
        }
        if (map[key].title === item.Findex) {
          let id = item.Fsinger_mid
          let name = item.Fsinger_name
          map[key].singers.push(new Singer({id, name}))
        }
      })
      let hot = []
      let ret = []
      for (let key in map) {
        let value = map[key]
        if (value.title.match(/[a-zA-Z]/)) {
          ret.push(value)
        } else if (value.title.match(HOT_NAME)) {
          hot.push(value)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      ret.unshift(hot[0])
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
