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
      default: false
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
        propsType: this.propsType
      })
      if (this.listenScroll) {
        let that = this
        this.scrollWapper.on('scroll', (pos) => {
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
    scrollTo () {
      this.scrollWapper && this.scrollWapper.scrollTo().apply(this.scrollWapper, arguments)
    },
    scrollToElement () {
      this.scrollWapper && this.scrollWapper.scrollToElement().apply(this.scrollWapper, arguments)

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
