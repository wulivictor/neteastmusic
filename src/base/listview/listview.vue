<template>
  <scroll class="listview" ref="listview"
          :data="data"
          :listenScroll=true
          :propsType=3
          :click=true @scroll="scroll">
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
    <div class="list-fixed" v-show="showTitle">
      <div class="fixed-title">
        {{listtitle}}
      </div>
    </div>
    <loading v-if="!data.length"></loading>
  </scroll>
</template>

<script type="text/ecmascript-6">
import loading from '../../base/loading/loading.vue'
import scroll from '../../base/scroll.vue'
import vue from 'vue'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
const SINGER_HEIGHT = 70
const PADDING_BOTTOM = 30

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
      shortcutindex: 0,
      AnchorHeightList: [],
      showTitle: true
    }
  },
  components: {
    scroll,
    loading
  },
  created () {
    this.touch = {}
  },
  methods: {
    scroll (pos) {
      if (pos.y > 0) {
        this.showTitle = false
      } else {
        this.showTitle = true
      }
      let y = Math.abs(pos.y)
      let list = this.AnchorHeightList
      for (let i = 0; i < list.length; i++) {
        let list1 = list[i]
        let list2 = list[i + 1]
        if (!list2 || (y >= list1 && y < list2)) {
          this.shortcutindex = i
          // console.log(i)
          return
        }
      }
    },
    touchshortcut (event) {
      // 触碰事件
      event = event || window.event
      let li = event.targetTouches[0].target
      // 获取触摸到的这个li
      let index = parseInt(li.getAttribute('dataindex'))
      this.touch.anchroindex = index
      if (!index && index !== 0) {
        return
      }
      // 记录这个shortcut的index
      this.shortcutindex = this.touch.anchroindex
      let firstTouch = event.touches[0]
      // 记录当前触摸道德这个li的中坐标
      this.touch.y1 = firstTouch.pageY
      // 控制左侧列表的滚动
      this.$refs.listview.scrollToElement(this.$refs.listitem[index], 0)
    },
    moveshortcut (event) {
      // 滑动事件
      event = event || window.event
      let firstTouch = event.touches[0]
      // 记录这个li的中坐标
      this.touch.y2 = firstTouch.pageY
      // 移动滑块 - 触碰滑块 的pageY ，再除以每个滑块的宽，就是左侧列表需要移动几个元素
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
    },
    listtitle () {
      let titleArray = []
      titleArray = this.data.map((group) => {
        return group.title
      })
      // console.log(titleArray[this.shortcutindex])
      return titleArray[this.shortcutindex]
    }
  },
  watch: {
    data () {
      // 当数据传递过来时生成一个左侧列表的纵坐标数组
      let heightListArray = []
      let height = 0
      heightListArray.push(height)
      let data = this.data
      for (let i = 0; i < data.length; i++) {
        height += data[i].singers.length * SINGER_HEIGHT + TITLE_HEIGHT + PADDING_BOTTOM
        heightListArray.push(height)
      }
      this.AnchorHeightList = heightListArray
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
