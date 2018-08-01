<template>
  <div class="progress-bar" ref="progressBar" @click="clickProgress()">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div> <!-- 这个是进度条，走了多远 -->
      <div class="progress-btn-wrapper">
        <div class="progress-btn" @touchmove="slideProgress"></div>    <!-- 这个是一个点，可以拖拽，前进后退-->
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
const BARWAPPERWIDTH = 13
export default {
  data () {
    return {
      barLength: 0,
      moveSpeed: 0,
      movedLenth: 0,
      btnPos: 0
    }
  },
  computed: {
    ...mapGetters([
      'currentIndex'
    ])
  },
  props: {
    currentPlayTime: {
      type: Number,
      default: 0
    },
    durationTime: {
      type: Number,
      default: 0
    },
    playState: {
      type: Boolean,
      default: false
    },
    currentSong: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 初始化相关参数信息
      let domWidth = document.documentElement.getBoundingClientRect().width
      // btn实际跑的距离
      // let btnrunlength = (domWidth - BARWAPPERWIDTH * 2) / domWidth
      this.barLength = this.$refs.progressBar.offsetWidth
      this.moveSpeed = this.barLength / this.durationTime
      this.btn = this.$refs.progressBar.getElementsByClassName('progress-btn')[0]
      this.btnPos = this.btn.offsetLeft
      // console.log(this.btnPos)
      this.movedLenth = 0
      // 播放状态setinterval
      if (this.playState) {
        this.progressMove()
      }
    })
  },
  methods: {
    clickProgress () {
      this.progressStop()

      // 定位按钮
      this.btnPos = window.event.clientX - window.innerWidth * 0.1 - 30
      this.btn.style.left = this.btnPos + 'px'
      this.movedLenth = this.btnPos
      this.$refs.progress.style.width = this.movedLenth + 'px'
      let time = this.btnPos / this.barLength * this.durationTime
      this.$emit('controlPlayTime', time)
      this.progressMove()
    },
    slideProgress (event) {
      // 在拖拽状态清楚定时器，避免干扰
      this.progressStop()
      // 计算按钮在屏幕中的clientx
      let preClientx = this.btnPos + window.innerWidth * 0.1 + 30
      event = window.event || event
      let clientx = event.targetTouches[0].clientX
      let move = clientx - preClientx
      let btnposInBar = this.btnPos + move
      let progressBarLength = this.$refs.progressBar.offsetWidth
      if (btnposInBar < 0 || btnposInBar > progressBarLength) {
        return
      }
      this.btn.style.left = btnposInBar + 'px'
      this.btnPos = this.btn.offsetLeft
      this.movedLenth = btnposInBar
      this.$refs.progress.style.width = this.movedLenth + 'px'
      // 计算需要改变的时间
      let time = this.movedLenth / this.barLength * this.durationTime

      // 控制歌曲进度
      this.$emit('controlPlayTime', time)
      this.progressMove()
    },
    progressMove () {
      let vm = this
      // 如果歌曲播放完了 ，清除定时器
      // if (this.currentPlayTime === this.durationTime) {
      //   // this.progressStop()
      //   console.log('交给父亲来管理')
      // }
      vm.progressRun = setInterval(() => {
        vm.movedLenth += vm.moveSpeed
        vm.btnPos += vm.moveSpeed
        vm.$refs.progress.style.width = vm.movedLenth + 'px'
        this.btn.style.left = vm.btnPos + 'px'
      }, 1000)
    },
    progressStop () {
      clearInterval(this.progressRun)
    }
  },
  watch: {
    playState (state) {
      let vm = this
      if (state) {
        vm.progressMove()
      } else {
        vm.progressStop()
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
