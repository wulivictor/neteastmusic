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
        propsType: this.propsType,
        enable () {
          this.scrollWapper && this.scrollWapper.enable()
        },
        disable () {
          this.scrollWapper && this.scrollWapper.disable()
        },
        refresh () {
          this.scrollWapper && this.scrollWapper.refresh()
        }
      })
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
