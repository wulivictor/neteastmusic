<template>
  <transition name="slide">
    <musiclist :title="title" :bgImage="bgImage" :songs:="songlist"></musiclist>.
  </transition>
</template>
<script type="text/ecmascript-6">
import {ERROR_OK} from 'api/common'
import {getSonglist} from 'api/song'
import {createSong} from 'common/js/song'
// import $ from 'jquery'
import musiclist from 'components/music-list/music-list.vue'

export default {
  components: {
    musiclist
  },
  data () {
    return {
      songlist: [],
      flag: false
    }
  },
  computed: {
    singer () {
      return this.$store.state.singer
    },
    title () {
      return this.singer.name
    },
    bgImage () {
      // 拼凑高清的avatar
      let url = this.singer.avatar
      let num = url.lastIndexOf('/')
      return url.substring(0, num + 6) + '300x300' + url.substring(num + 13, url.length)
    }
  },
  created () {
    // console.log(this.singer)
  },
  mounted () {
    let id = this.singer.id
    setTimeout(() => {
      this._getSonglist(id)
    }, 30)
  },
  methods: {
    _normalizeSongs (list) {
      if (!list) {
        return
      }
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        if (musicData.songmid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _getSonglist (singerId) {
      if (!this.singer.id) {
        this.$route.push({
          path: '/singer'
        })
        return
      }
      getSonglist(singerId).then((response) => {
        if (ERROR_OK === response.code) {
          let list = response.data.list
          if (!list) {
            return
          }
          let songs = this._normalizeSongs(list)
          this.songlist = songs
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"

.slide-leave-active,.slide-enter-active
  transition all .3s
.slide-enter,.slide-leave-to
  transform translate3d(100%, 0, 0)

.singer-detail
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color $color-background
</style>
