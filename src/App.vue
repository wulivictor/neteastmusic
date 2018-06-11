<template>
  <div id="app">
    <mheader></mheader>
    <tab></tab>
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import mheader from 'components/m-header/m-header.vue'
import tab from 'components/tab/tab.vue'
export default {
  name: 'App',
  components: {
    mheader,
    tab
  }
}
</script>

<style>

</style>
