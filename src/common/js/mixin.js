import {mapGetters, mapMutations} from 'vuex'
export const searchmixin = {
  data () {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapMutations({
      setSearchHistory: 'SET_SEARCH_HISTORY'
    }),
    onQueryChange (newQuery) {
      this.query = newQuery
      if (newQuery) {
        this.saveQuery(newQuery)
      }
    },
    addQuery (queryKey) {
      this.$refs.searchBox.setQuery(queryKey)
    },
    saveQuery (query) {
      let arr = []
      if (this.searchHistory.length) {
        arr = this._deleteEleInArray(this.searchHistory, query) // 如果有重复的搜索元素，直接删除，在到下面的语句中置顶添加
      }
      arr.unshift(query)
      this.setSearchHistory(arr)
    },
    selectSearchHistory (item) {
      this.$refs.searchBox.setQuery(item) // 这里设置query 搜索关键词要从searchbox中设置，因为是search监听searchbox，如果只改变search中的query，那么搜索框中的文字就没有了
    },
    deleteSearchHistory (item) {
      let arr = this._deleteEleInArray(this.searchHistory, item)
      this.setSearchHistory(arr)
    },
    _deleteEleInArray (array, arrayEle) { // 查找是否有重复元素，有则删除数组中指定元素
      let arrayIndex
      let ret = array
      array.forEach((ele, index) => {
        if (ele === arrayEle) {
          arrayIndex = index
        }
      })
      if (arrayIndex) {
        ret.slice(arrayIndex, 1)
      }
      return ret
    }
  }
}
