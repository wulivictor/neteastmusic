<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" :refreshDelay="refreshDelay" ref="shortcut" :data="shortcut"><!-- 快捷搜索-->
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" v-bind:key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span  class="clear"><!--@click="showConfirm"-->
                <i class="icon-clear"></i>
              </span>
            </h1>
            <!--<search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>-->
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <!--<suggest @listScroll="blurInput" @select="saveSearch" ref="suggest" :query="query"></suggest>-->
    </div>
    <!--<confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>-->
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import scroll from '../../base/scroll.vue'
import searchbox from 'base/search-box/search-box.vue'
import {getHotKey} from '../../api/search.js'
import {ERROR_OK} from '../../api/common'
import {searchmixin} from '../../common/js/mixin.js'

export default {
  mixins: [searchmixin],
  data () {
    return {
      hotKey: []
    }
  },
  created () {
    this._getHotKey()
  },
  components: {
    scroll,
    'search-box': searchbox
  },
  methods: {
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERROR_OK) {
          this.hotKey = res.data.hotkey
        }
      })
    }
  },
  computed: {
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
