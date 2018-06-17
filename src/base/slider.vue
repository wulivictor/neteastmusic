<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="item in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {addClass} from '../common/js/dom'
import BScroll from 'better-scroll'
export default {
  data () {
    return {
      dots: []
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
      default: 4000
    }
  },
  mounted () {
    setTimeout(() => {
      // 等待20毫秒初始化组件的宽度和初始化slider
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
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
    },
    _initDots () {
      let dots = new Array(this.children)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
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