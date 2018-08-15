<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
  @searchMore="searchMore">
          <!--:beforeScroll="beforeScroll"-->
          <!--@scrollToEnd="searchMore"-->
          <!--@beforeScroll="listScroll"-->

    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" v-bind:key="index" @click="selectItem(item, index)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!--<loading v-show="hasMore" title=""></loading>-->
    </ul>
    <div  class="no-result-wrapper" v-if="!result.length">
      抱歉，暂无搜索结果
      <!--<no-result title="抱歉，暂无搜索结果"></no-result>-->
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from '../../api/search.js'
import scroll from '../../base/scroll.vue'
import {ERROR_OK} from '../../api/common'
import {createSong} from '../../common/js/song'
import {TYPE_SINGER} from '../../common/js/config'
import {mapMutations, mapGetters} from 'vuex'
import {searchPlay} from '../../store/getter'

const perpage = 20
const showSinger = true
export default {
  components: {
    scroll
  },
  data () {
    return {
      result: [],
      page: 1,
      perpage: '',
      pullup: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters([
      searchPlay
    ])
  },
  methods: {
    ...mapMutations({
      setsearchPlay: 'SET_SEARCH_PLAY'
    }),
    selectItem (item, index) {
      this.$emit('selectSearchResult', item)
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    search () {
      search(this.query, this.page, showSinger, perpage).then((res) => {
        if (res.code === ERROR_OK) {
          this.result = this._genResult(res.data)

          // 将搜索的歌曲先存下来，一边播放使用
          let searchSongs = []
          let searchPlay = {}
          this.result.forEach((ele, index) => {
            if (!ele.type) {
              searchSongs.push(ele)
            }
          })
          if (searchSongs.length > 0) {
            searchPlay = searchSongs
            this.setsearchPlay(searchPlay)
          }
        }
      })
    },
    _genResult (data) { // 这里的类型有歌手或者是歌曲，需要判断，然后合并
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}}) // 这我没看懂
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    searchMore () {
      // 上拉加载
      this.page++
      console.log(this.page)
      search(this.query, this.page, showSinger, perpage).then((res) => {
        if (res.code === ERROR_OK) {
          let ret = this._genResult(res.data)
          this.result = this.result.concat(ret)
          this.$refs.suggest.finishPullUp()
        }
      })
    }
  },
  watch: {
    query (newQuery) {
      this.search()
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
