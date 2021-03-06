<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" v-bind:key="index" v-bind:class="{active : currentPageIndex === index}"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import {addClass} from 'api/dom'
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: { // 使用参数控制slider组件
    loop: { // 是否轮播
      type: Boolean,
      default: true
    },
    autoPlay: { // 是否轮播
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 1000
    }
  },
  mounted () {
    setTimeout(() => {
      // 等待20毫秒初始化组件的宽度和初始化slider
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      // 自动播放
      if (this.autoPlay) {
        this._autoPlay()
      }
    })

    window.addEventListener('resize', () => {
      if (this.sliderWapper) {
        this._setSliderWidth()
      }
    })
  },
  methods: {
    _setSliderWidth () {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider () {
      this.sliderWapper = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, // 关闭或者打开惯性运动的执行
        snap: {
          loop: this.loop, // 无限滚动
          threshold: 0,
          speed: 400 // 滑动的时间
        },
        click: true
      })
      this.sliderWapper.on('scrollEnd', () => {
        let currentPage = this.sliderWapper.getCurrentPage().pageX
        this.currentPageIndex = currentPage
        // 在自己手动滚动后，清空一次自动滚动
        if (this.autoPlay) {
          clearTimeout(this.time)
          this._autoPlay()
        }
      })
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _autoPlay () {
      let pageIndex = this.currentPageIndex
      this.time = setTimeout(() => {
        this.sliderWapper.goToPage((++pageIndex) % 5)
      }, this.interval)
    }
  },
  destroyed () {
    clearTimeout(this.time) // 当从当前页面跳出时，清空定时器资源
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    position: relative;
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
