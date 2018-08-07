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
        <div class="middle"
             @touchstart="ontouchstart()"
             @touchmove="ontouchmove()">
          <transition name="fade">
            <div class="middle-l" ref="middleL" v-show="playUI">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="playState ? 'play' : 'pause'">
                  <img class="image" :src="currentSong.image">
                </div>
              </div>

              <div class="miniLyricWrapper" v-if="showminiLyric">
                <div class="miniLyric">
                  {{miniLyric}}
                </div>
              </div>
            </div>
          </transition>
          <transition name="fade">
            <div class="middle-r" ref="lyricList" v-if="this.currentLyric" v-show="!playUI"> <!--使用betterscroll 滚动歌词 -->
              <div class="lyric-wrapper">
                <div class="currentLyric">
                  <p class="text" ref="lyricLine" v-for="(text, index) in currentLyric.lines" v-bind:key="index" v-bind:class="{'current' : currentLine === index}">
                    {{text.txt}}
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <div class="dot" v-bind:class="{'active':playUI}"></div>
            <div class="dot" v-bind:class="{'active':!playUI}"></div>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime | filtertime}}</span>
            <div class="progress-bar-wrapper">
              <progressbar :currentPlayTime="currentTime"
                           :durationTime="currentSong.duration"
                           :playState="playState"
                           :currentSong = "currentSong"
                           v-if="currentTime"
                           @controlPlayTime="controlPlayTime"
                           ref="playprogressbar"></progressbar>
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
import BScroll from 'better-scroll'
import Lyric from 'lyric-parser'
export default {
  data () {
    return {
      currentTime: 0,
      currentLyric: null,
      currentLine: -1,
      playUI: true,
      miniLyric: '',
      showminiLyric: false,
      touchPos: {
        touchstart: 0,
        touchmove: 0
      }
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
    randomController () {
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
    },
    // 用于制作随机播放列表
    randomSort (a, b) {
      return Math.random() > 0.5 ? -1 : 1 // 这个很有意思
    },
    randomPlaylist () {
      let random = []
      let number = []
      for (let i = 0; i < this.sequencelist.length; i++) {
        number.push(i)
      }
      number.sort(this.randomSort)
      number.forEach((ele, index) => {
        random.push(this.sequencelist[ele])
      })
      random.forEach((ele, index) => {
        if (ele.id === this.currentSong.id) {
          this.setCurrentIndex(index)
        }
      })
      this.setPlayList(random)
    },
    switchPlayMode () {
      // 需求： 改变播放列表的顺序，但是给用户显示的还是顺序播放列表， 改变播放模式默认会切换歌曲，因为currentSong是getter计算出来的，所以为了不重新切换歌曲，还需要计算index
      if (this.mode === 0) {
        let loop = []
        for (let n = 0; n < this.sequencelist.length; n++) {
          loop.push(this.currentSong)
        }
        this.setPlayMode(1)
        this.setPlayList(loop)
      } else if (this.mode === 1) {
        this.setPlayMode(2)
        this.randomPlaylist()
      } else if (this.mode === 2) {
        this.setPlayMode(0)
        for (let i = 0; i < this.sequencelist.length; i++) {
          if (this.sequencelist[i] === this.currentSong) {
            // 这里改变模式需要重新计算index， 因为currentsong是有plyalist和index计算出来的
            // 避免切换歌曲
            this.setPlayList(this.sequencelist)
            this.setCurrentIndex(i)
            return
          }
        }
      }
    },
    controlPlayTime (time) {
      // 控制播放快进
      let audio = this.$refs.audio
      if (time >= 0 || time <= this.currentSong.duration) {
        audio.currentTime = time
      }
      // 控制歌词进度

      this.currentLyric.seek(time * 1000)
    },
    getCurrentTime (e) {
      this.currentTime = e.target.currentTime
    },
    loopmode () {
      if (this.mode === 1) {
        this.$refs.audio.load()
      }
    },
    next () {
      if (this.currentLyric) {
        this.currentLyric.stop()
      }

      this.loopmode()
      if (this.mode === 2) {
        this.randomPlaylist()
      }
      // 控制下一首
      if (this.currentIndex < this.playlist.length - 1) {
        this.setCurrentIndex(this.currentIndex + 1)
      } else {
        this.setCurrentIndex(0)
      }
    },
    prev () {
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      // 控制上一首
      this.loopmode()
      if (this.mode === 2) {
        this.randomPlaylist()
      }
      if (this.currentIndex !== 0) {
        this.setCurrentIndex(this.currentIndex - 1)
      } else {
        this.setCurrentIndex(this.playlist.length - 1)
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
      if (this.$refs.audio.readyState !== 4) {
        return
      }
      // 设置过去播放状态
      this.setplayState(!this.playState)
      // 设置歌词播放状态
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    getLyric () {
      this.currentSong.getlyric().then((lyric) => {
        if (!lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playState) {
          this.currentLyric.play()
        }
        this._initlyricScroll()
      })
      // 屏幕太小，隐藏
      if (window.innerHeight >= 600) {
        this.showminiLyric = true
      }
    },
    handleLyric ({lineNum, txt}) {
      this.miniLyric = txt
      this.currentLine = lineNum
      if (this.currentLine > 7) {
        let scrollDom = this.$refs.lyricLine[lineNum - 7]
        this.lyricScroll.scrollToElement(scrollDom, 400)
      }
    },
    _initlyricScroll () { // 初始化 歌词滚动
      this.$nextTick(() => {
        this.lyricScroll = new BScroll(this.$refs.lyricList, {})
      })
    },
    ontouchstart (event) {
      event = event || window.event
      this.touchPos.touchstart = event.targetTouches[0].clientX
    },
    ontouchmove (event) {
      event = event || window.event
      this.touchPos.touchmove = event.targetTouches[0].clientX
      if ((this.touchPos.touchmove - this.touchPos.touchstart) > 100) {
        this.playUI = true
      }

      if ((this.touchPos.touchstart - this.touchPos.touchmove) > 100) {
        this.playUI = false
      }
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
    currentIndex () {
      // progressRun
      if (this.$refs.playprogressbar && this.$refs.playprogressbar.progressRun) {
        this.$refs.playprogressbar.progressStop()
      }
    },
    currentTime (time) {
      if (this.$refs.audio.ended) {
        this.$refs.playprogressbar.progressStop()
        this.setplayState(false)
        if (this.currentIndex + 1 <= this.playlist.length) {
          this.setCurrentIndex(this.currentIndex + 1)
        } else {
          this.setCurrentIndex(0)
        }
      }
    },
    currentSong () {
      // 切换歌曲 清空上首歌的定时器
      if (this.$refs.playprogressbar && this.$refs.playprogressbar.progressRun) {
        this.$refs.playprogressbar.progressStop()
      }
      // 切换歌曲 清空上首歌的歌词任务
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        let promise = this.$refs.audio.play()
        promise && promise.catch(function (reseon) {
        })
        // 获取歌词
        this.getLyric()
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .miniLyricWrapper
    height: 10%;
    width: 100%;
    position: absolute;
    margin-top: 20%;
    padding: 0 10%;
    box-sizing border-box
    .miniLyric
      margin: 0 auto
      overflow: hidden
      text-align: center
      line-height: 32px
      font-size: $font-size-medium
      color: $color-text
</style>
