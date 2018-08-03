<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="songList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="(item, index) in recommends" v-bind:key="index">
              <a :href="item.linkUrl">
                <img class="needsclick"  :src="item.picUrl"> <!-- @load="loadImage"-->
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item, index) in songList" class="item" v-bind:key="index">
              <div class="icon">
                <img width="60" height="60" @load="loadimg" v-lazy="item.picUrl"> <!-- v-lazy="item.imgurl"-->
              </div>
              <div class="text">
                <h2 class="name" v-html="item.songListAuthor"></h2>
                <p class="desc" v-html="item.songListDesc"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!songList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view :bgimage="bgimage"
                 :title="title"
                 :rank="rank">
    </router-view>
  </div>
</template>
<script type="text/ecmascript-6">
import {getRecommand} from 'api/recommand'
import {ERROR_OK} from 'api/common'
import slider from 'base/slider.vue'
import scroll from 'base/scroll.vue'
import loading from 'base/loading/loading.vue'
import {getRecommendDiss} from '../../api/recommand'
import musiclist from 'components/music-list/music-list.vue'
import {mapMutations} from 'vuex'
import {createRecommend} from '../../common/js/song.js'
export default {
  name: 'Recommend',
  components: {
    slider,
    scroll,
    loading,
    musiclist
  },
  data () {
    return {
      recommends: [],
      songList: [],
      bgimage: '',
      title: '',
      rank: false
    }
  },
  created () {
    this._getcommand()
    setTimeout(() => {
      this._getSongList()
    }, 500)
  },
  methods: {
    ...mapMutations({
      setSong: 'SET_SONGS'
    }),
    _getcommand () {
      getRecommand().then((res) => {
        if (res.code === ERROR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getSongList () {
      getRecommand().then((res) => {
        if (res.code === ERROR_OK) {
          this.songList = res.data.songList
        }
      })
    },
    loadimg () {
      if (!this.checkloaded) {
        this.$refs.scroll.refresh()
        this.checkloaded = true
      }
    },
    _handleDiss (item) {
      this.bgimage = item.picUrl
      this.title = item.songListDesc
      getRecommendDiss(item.id).then((res) => {
        res = res.data
        if (res.code === ERROR_OK) {
          let recommendSonglist = res.cdlist[0].songlist
          let songlist = []
          recommendSonglist.forEach((ele, index) => {
            let song = createRecommend(ele)
            songlist.push(song)
          })
          this.setSong(songlist)
        }
      })
    },
    selectItem (item) {
      // 处理子路由需要的数据
      this._handleDiss(item)
      // 跳转子路由
      this.$router.push({
        path: `recommend/${item.id}`
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable.styl'
.recommend
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .recommend-content
    height: 100%
    overflow: hidden
    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden
.recommend-list
  .list-title
    height: 65px
    line-height: 65px
    text-align: center
    font-size: $font-size-medium
    color: $color-theme
  .item
    display: flex
    box-sizing: border-box
    align-items: center
    padding: 0 20px 20px 20px
    .icon
      flex: 0 0 60px
      width: 60px
      padding-right: 20px
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      font-size: $font-size-medium
      .name
        margin-bottom: 10px
        color: $color-text
      .desc
        color: $color-text-d
.loading-container
  position: absolute
  width: 100%
  top: 50%
  transform: translateY(-50%)
</style>
