import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../../src/components/recommend/recommend.vue'
import Search from '../../src/components/search/search.vue'
import Singer from '../../src/components/singer/singer.vue'
import Rank from '../../src/components/rank/rank.vue'
import SingerDetail from '../../src/components/singer-detail/singer-detail.vue'
import MusicList from '../../src/components/music-list/music-list.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: MusicList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    }
  ]
})
