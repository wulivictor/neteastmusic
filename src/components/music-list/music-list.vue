<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">  <!-- 这里的原理是 这个image层是相对定位，没高度，padding为40% -->
      <div class="play-wrapper">
        <div ref="playBtn" v-show="false" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>        <!-- 这个隔层为相对布局，高度为100%，和image并列，有一部分没娴熟出来，背景和list的颜色是一样的 -->
    <scroll :data="songs" @scroll="scrolllsit"
            :listen-scroll="listenScroll" :propsType="probeType" class="list" ref="list">   <!--这个list为固定定位，只不过当滑动时，超过的内容没有overflow-->
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll'
import Loading from 'base/loading/loading'
import SongList from 'base/song-list/song-list'
// import {mapMutations} from 'vuex'
export default {
  props: {
    bgimage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0,
      songlist: []
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgimage})`
    },
    songs () {
      return this.$store.state.songs
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    // 获取背景图的高度，当画到一定的高度时layer不在位移
    this.imageHeight = this.$refs.bgImage.offsetHeight
    // console.log(this.imageHeight)
    // list和layer的位置没对齐，计算位置
    this.fixHeight = this.fixHeight()
  },
  methods: {
    fixHeight () {
      let width = window.innerWidth
      let height = window.innerHeight
      let fixHeight = height - width * 0.7 - height * 0.6
      return fixHeight
    },
    scrolllsit (pos) {
      this.scrollY = pos.y
      let maxScrollMove = Math.abs(this.scrollY) <= this.imageHeight + this.fixHeight
      if (maxScrollMove) {
        this.$refs.layer.style.webkitTransform = 'translate(0px,' + this.scrollY + 'px) scale(1) translateZ(0px)'
      }
    },
    back () {
      this.$router.back()
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    }
  },
  components: {
    Scroll,
    Loading,
    SongList
  },
  watch: {
    songs (newvue) {
      this.songlist = newvue
      debugger
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background
  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50
    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme
  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text
  .bg-image
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    transform-origin: top
    background-size: cover
    .play-wrapper
      position: absolute
      bottom: 20px
      z-index: 50
      width: 100%
      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0
        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x
        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    background: $color-background
  .list
    position: fixed
    top: 40%
    bottom: 0
    width: 100%
    background: $color-background
    .song-list-wrapper
      padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
