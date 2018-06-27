<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>
<script type="text/ecmascript-6">
import {getSingerDetail} from '../../api/singer'
import {ERROR_OK} from '../../api/common'
import {getMusic} from '../../api/song'
import {createSong} from '../../common/js/song'
import $ from 'jquery'

export default {
  data () {
    return {
      songlist: {}
    }
  },
  computed: {
    singer () {
      return this.$store.state.singer
    }
  },
  created () {
    // console.log(this.singer)
  },
  mounted () {
    setTimeout((this.getsingerDetail(this.singer.id)), 30)
  },
  methods: {
    _normalizeSongs (list) {
      if (!list) {
        return
      }
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        if (musicData.songid && musicData.songmid) {
          getMusic(musicData.songmid).then((res) => {
            res = $.parseJSON(res)
            if (res.code === ERROR_OK) {
              const filename = res.data.items[0].filename
              const svkey = res.data.items
              const songVkey = svkey[0].vkey
              const newSong = createSong(musicData, songVkey, filename)
              ret.push(newSong)
            }
          })
        }
      })
      console.log(ret)
      return ret
    },
    getsingerDetail (singerId) {
      if (!this.singer.id) {
        this.$route.push({
          path: '/singer'
        })
        return
      }
      getSingerDetail(singerId).then((response) => {
        if (ERROR_OK === response.code) {
          this.songlist = this._normalizeSongs(response.data.list)
          // console.log(this.songlist)
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
