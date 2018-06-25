<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>
<script type="text/ecmascript-6">
export default {
  computed: {
    singer () {
      return this.$store.state.singer
    }
  },
  created () {
    console.log(this.singer)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"

.slide-leave-active,.slide-enter-active
  transition all .3s
.slide-enter,.slide-leave-to
  transform translate3d(100%, 0, 0)

.singer-detail
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color $color-background
</style>
