<template>
  <!--<div class="recommend" ref="recommend">-->
    <!--<scroll ref="scroll" class="recommend-content" :data="discList">-->
      <!--<div>-->
        <!--<div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">-->
          <!--<slider>-->
            <!--<div v-for="item in recommends">-->
              <!--<a :href="item.linkUrl">-->
                <!--<img class="needsclick" @load="loadImage" :src="item.picUrl">-->
              <!--</a>-->
            <!--</div>-->
          <!--</slider>-->
        <!--</div>-->
        <!--<div class="recommend-list">-->
          <!--<h1 class="list-title">热门歌单推荐</h1>-->
          <!--<ul>-->
            <!--<li @click="selectItem(item)" v-for="item in discList" class="item">-->
              <!--<div class="icon">-->
                <!--<img width="60" height="60" v-lazy="item.imgurl">-->
              <!--</div>-->
              <!--<div class="text">-->
                <!--<h2 class="name" v-html="item.creator.name"></h2>-->
                <!--<p class="desc" v-html="item.dissname"></p>-->
              <!--</div>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="loading-container" v-show="!discList.length">-->
        <!--<loading></loading>-->
      <!--</div>-->
    <!--</scroll>-->
    <!--<router-view></router-view>-->
  <!--</div>-->
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      getRecommandOption: {
        g_tk: '5381',
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        _: 1528702760044
      }
    }
  },
  name: 'Recommand',
  created () {
    this.getRecommand()
  },
  methods: {
    getRecommand () {
      this.$http.jsonp('https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg', this.getRecommandOption).then(response => {
        console.log('succ' + response.body)
      }, response => {
        debugger
        console.log('err' + response.body)
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
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
