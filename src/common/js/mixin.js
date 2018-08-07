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
      this.saveQuery(newQuery)
    },
    addQuery (queryKey) {
      this.$refs.searchBox.setQuery(queryKey)
    },
    saveQuery (query) {
      this.setSearchHistory(query)
    }
  }
}
