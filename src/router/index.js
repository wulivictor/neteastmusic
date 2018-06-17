import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../../src/components/recommend/recommend.vue'
import Search from '../../src/components/search/search.vue'
import Singer from '../../src/components/singer/singer.vue'
import Rank from '../../src/components/rank/rank.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/singer',
      component: Singer
    },
    {
      path: '/rank',
      component: Rank
    }
  ]
})
