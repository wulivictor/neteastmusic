<template>
  <div ref="scrollref">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  name: 'scroll',
  props: {
    propsType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: true
    },
    refreshDelay: {
      type: Number,
      default: 1000
    }
  },
  mounted () {
    setTimeout(() => {
      if (!this.scrollWapper) {
        this._initScroll()
      }
    }, 20)
  },
  methods: {
    _initScroll () {
      this.scrollWapper = new BScroll(this.$refs.scrollref, {
        click: this.click,
        probeType: this.propsType, // 有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，
        // 会非实时（屏幕滑动超过一定时间后）派发scroll 事件；当 probeType 为 2 的时候，
        // 会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，
        // 不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
        preventDefault: true,
        momentum: true
      })
      // 通过滚动事件再监听 列表的坐标
      let that = this
      if (this.listenScroll) {
        this.scrollWapper.on('scroll', (pos) => {
          // 向父组件传递自定义事件
          // console.log('x:' + pos.x + '\ty:' + pos.y)
          that.$emit('scroll', pos)
        })
      }
    },
    enable () {
      this.scrollWapper && this.scrollWapper.enable()
    },
    disable () {
      this.scrollWapper && this.scrollWapper.disable()
    },
    refresh () {
      this.scrollWapper && this.scrollWapper.refresh()
    },
    scrollTo (el, time) {
      this.scrollWapper && this.scrollWapper.scrollTo(this.scrollWapper, arguments)
    },
    scrollToElement (el, time) {
      this.scrollWapper && this.scrollWapper.scrollToElement(el, time)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.scrollWapper.refresh()
      }, 20)
    }
  }
}
</script>
