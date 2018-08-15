<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll class="shortcut" :refreshDelay="refreshDelay" ref="shortcut" :data="shortcut" :type=3><!-- 快捷搜索-->
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" v-bind:key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length"> <!--这是搜索历史记录 -->
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span  class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="selectSearchHistory" @delete="deleteSearchHistory"></search-list> <!-- 选中搜索记录和删除搜索记录的操作-->
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult"> <!--搜索结果 -->
      <suggest ref="suggest" :query="query" @selectSearchResult="selectSearchResult"></suggest><!--@listScroll="blurInput" @select="saveSearch" -->
    </div>
    <!--<confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>-->
    <router-view></router-view> <!--如果是歌曲直接播放，如果是歌手直接跳转到歌手详情页面 -->
  </div>
</template>

<script type="text/ecmascript-6">
import scroll from 'base/scroll.vue'
import searchbox from 'base/search-box/search-box.vue'
import {getHotKey} from '../../api/search.js'
import {ERROR_OK} from '../../api/common'
import {searchmixin} from '../../common/js/mixin.js'
import searchlist from '../../base/search-list/search-list.vue'
import suggest from '../../components/suggest/suggest.vue'
import {TYPE_SINGER} from '../../common/js/config'
import Singer from '../../common/js/singer.js'
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
    'search-box': searchbox,
    'search-list': searchlist,
    suggest
  },
  methods: {
    selectSearchResult (item) {
      if (item.type === TYPE_SINGER) {
        let id = item.singermid
        let name = item.singername
        let searchSinger = new Singer({id, name})
        this.setSinger(searchSinger)
        // 跳转路由
        this.$router.push({
          path: `search/${item.singermid}`
        })
      } else {
        // play song and set data
        let playlistIndex
        this.searchPlay.forEach((ele, index) => {
          if (ele.id === item.id) {
            playlistIndex = index
          }
        })
        this.selectPlay({
          list: this.searchPlay,
          index: playlistIndex
        })

        // push route

      }
    },
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERROR_OK) {
          this.hotKey = res.data.hotkey
        }
      })
    },
    showConfirm () { // 清楚搜索记录
      this.setSearchHistory([])
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
