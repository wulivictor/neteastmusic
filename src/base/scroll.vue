<template>
  <div ref="scrollref">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  name: 'scroll',
  mounted () {
    this._initScroll()
  },
  methods: {
    _initScroll () {
      debugger
      this.scrollWapper = new BScroll(this.$refs.scrollref, {
        click: true
      })
    }
  }
}
</script>
