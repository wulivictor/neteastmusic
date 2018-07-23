<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.image" width="100%" height="100%">
      </div>
      <div class="top">
        <div class="back" @click="back()">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle">
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" :class="playState ? 'play' : 'pause'">
              <img class="image" :src="currentSong.image">
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{currentTime | filtertime}}</span>
          <div class="progress-bar-wrapper">
            <progressbar :currentPlayTime="currentTime"
                         :durationTime="currentSong.duration"
                         :playState="playState"
                         :currentSong = "currentSong"
                         v-if="currentTime" @controlPlayTime="controlPlayTime" ref="progressbar"></progressbar>
          </div>
          <span class="time time-r">{{currentSong.duration | filtertime}}</span>
          </div>
        <div class="operators">
          <div class="icon i-left">
            <i @click="switchPlayMode()" :class="changeModeIcon"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev" @click="prev()"></i>
          </div>
          <div class="icon i-center">
            <i @click="togglePlaying" :class="playState ? 'icon-pause' : 'icon-play'"></i>
          </div>
          <div class="icon right">
            <i class="icon-next" @click="next()"></i>
          </div>
          <div class="icon right">
            <i class="icon icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click.stop="into()">
      <div class="icon">
        <img width="40" height="40" :src="currentSong.image" :class="playState ? 'play' : 'pause'">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <i @click.stop="togglePlaying" :class="miniicon"></i>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </transition>
    <audio :src="currentSong.url" ref="audio" @timeupdate="getCurrentTime"></audio>
</div>
</template>
<script type="text/ecmascript-6">
// sequence: 0,
// loop: 1,
// random: 2
import {mapGetters, mapMutations} from 'vuex'
// import animation from 'create-keyframe-animation'
import progressbar from 'components/progressbar/progress-bar.vue'
export default {
  data () {
    return {
      currentTime: 0
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playState',
      'currentIndex',
      'mode',
      'sequencelist'
    ]),
    miniicon () {
      if (this.playState) {
        return 'icon-pause-mini'
      } else {
        return 'icon-play-mini'
      }
    },
    changeModeIcon () {
      if (this.mode === 0) {
        return 'icon-sequence'
      } else if (this.mode === 1) {
        return 'icon-loop'
      } else {
        return 'icon-random'
      }
    }
  },
  methods: {
    // 用于制作随机播放列表
    randomSort (a, b) {
      return Math.random() > 0.5 ? -1 : 1 // 这个很有意思
    },
    switchPlayMode () {
      // 需求： 改变播放列表的顺序，但是给用户显示的还是顺序播放列表， 改变播放模式默认会切换歌曲，因为currentSong是getter计算出来的，所以为了不重新切换歌曲，还需要计算index
      if (this.mode === 0) {
        this.setPlayMode(1)
        let loop = []
        loop.push(this.playlist[this.currentIndex])
        // 重新计算index，因为currentSong是计算出来的，list和index都变了，curreentSong也会变
        this.setCurrentIndex(0)
        this.setPlayList(loop)
      } else if (this.mode === 1) {
        this.setPlayMode(2)

        let array = []
        for (let i = 0; i < this.sequencelist.length; i++) {
          array.push(i)
        }
        array.sort(this.randomSort)
        let random = []
        for (let i = 0; i < array.length; i++) {
          random.push(this.sequencelist[array[i]])
        }
        let currentIndex = 0
        random.forEach((ele, index) => {
          if (ele.id === this.currentSong.id) {
            currentIndex = index
          }
        })
        this.setCurrentIndex(currentIndex)
        this.setPlayList(random)
      } else if (this.mode === 2) {
        this.setPlayMode(0)
        this.setPlayList(this.sequencelist)
      }
    },
    controlPlayTime (time) {
      // 控制播放快进
      let audio = this.$refs.audio
      if (time >= 0 || time <= this.currentSong.duration) {
        audio.currentTime = time
      }
    },
    getCurrentTime (e) {
      this.currentTime = e.target.currentTime
    },
    next () {
      // 控制下一首
      if (this.currentIndex < this.playlist.length - 1) {
        this.setCurrentIndex(this.currentIndex + 1)
      }
    },
    prev () {
      // 控制上一首
      if (this.currentIndex !== 0) {
        this.setCurrentIndex(this.currentIndex - 1)
      }
    },
    back () {
      this.setfullScreen(false)
    },
    into () {
      this.setfullScreen(true)
    },
    ...mapMutations({
      setfullScreen: 'SET_FULLSCREEN',
      setplayState: 'SET_PLAY_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    togglePlaying () {
      this.setplayState(!this.playState)
    }
  },
  filters: {
    filtertime: function (time) {
      let playedtime = Math.floor(time) || 0
      let minuter = Math.floor(playedtime / 60)
      let second = playedtime % 60
      if (second < 10) {
        second = '0' + second
      }
      return `${minuter}:${second}`
    }
  },
  watch: {
    currentTime (time) {
      if (this.$refs.audio.ended) {
        this.$refs.progressbar.progressStop()
        this.setplayState(false)
        if (this.currentIndex + 1 <= this.playlist.length) {
          this.setCurrentIndex(this.currentIndex + 1)
        } else {
          this.setCurrentIndex(0)
        }
      }
    },
    currentSong () {
      this.$nextTick(() => {
        let promise = this.$refs.audio.play()
        promise && promise.catch(function (reseon) {
          console.log(reseon)
        })
      })
      this.setplayState(true)
    },
    playState (flag) {
      flag ? this.$refs.audio.play() : this.$refs.audio.pause()
    }
  },
  components: {
    progressbar
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
