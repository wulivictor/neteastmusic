<template>
  <transition name="slide">
    <music-list :songs:="songs" :title="title" :bgimage="bgimage"  :rank="true" v-if="flag"></music-list>.
  </transition>
</template>
<script type="text/ecmascript-6">
import {ERROR_OK} from 'api/common'
import {getSonglist} from 'api/song'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list.vue'
import {mapMutations} from 'vuex'

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: [],
      flag: false
    }
  },
  computed: {
    singer() {
      return this.$store.state.singer
    },
    title() {
      return this.singer.name
    },
    bgimage() {
      let image = 'http://y.gtimg.cn/music/photo_new/T001R300x300M000' + this.singer.id + '.jpg?max_age=2592000'
      return image
    }
  },
  mounted() {
    let id = this.singer.id
    setTimeout(() => {
      this._getSonglist(id)
    }, 60)
  },
  methods: {
    ...mapMutations({
      setSongs: 'SET_SONGS'
    }),
    _normalizeSongs(list) {
      if (!list) {
        return
      }
      let ret = []
      list.forEach(item => {
        let {musicData} = item
        if (musicData.songmid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _getSonglist(singerId) {
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
          this.songs = songs
          this.setSongs(songs)
        }
      })
    }
  },
  watch: {
    songs (newvue, oldvue) {
      if (newvue) {
        this.flag = true
      }
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
 </style>
