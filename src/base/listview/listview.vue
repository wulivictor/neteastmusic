<template>
  <scroll :data="data" class="listview" ref="listview">
    <ul>
      <li v-for="(group, index) in data" class="list-group" v-bind:key="index" ref="listitem">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) in group.singers" class="list-group-item" v-bind:key="index">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="touchshortcut" @touchmove.stop.prevent="moveshortcut">
      <ul>
        <li v-for="(item, index) in shortcut" v-bind:class="{current : shortcutindex === index}" v-bind:key="index" class="item" :dataindex="index" >
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import scroll from '../../base/scroll.vue'
const ANCHOR_HEIGHT = 18

export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      shortcutindex: -1
    }
  },
  components: {
    scroll
  },
  created () {
    this.touch = {}
  },
  methods: {
    touchshortcut (event) {
      event = event || window.event
      let li = event.targetTouches[0].target
      // 获取触摸到的这个li
      let index = li.getAttribute('dataindex') - 0
      this.touch.anchroindex = index
      this.shortcutindex = this.touch.anchroindex

      let firstTouch = event.touches[0]
      // 记录当前触摸道德这个li的中坐标
      this.touch.y1 = firstTouch.pageY
      this.$refs.listview.scrollToElement(this.$refs.listitem[index], 0)
    },
    moveshortcut (event) {
      event = event || window.event
      let firstTouch = event.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let moveTouchIndex = this.touch.anchroindex + delta
      this.shortcutindex = moveTouchIndex
      this.$refs.listview.scrollToElement(this.$refs.listitem[moveTouchIndex], 0)
    }
  },
  computed: {
    shortcut () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
