<template>
  <div id="app">
    <mheader></mheader>
    <tab></tab>
    <keep-alive> <!-- 当路由跳转之后，这个组件中的dom不会被清空-->
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>
<script type="text/ecmascript-6">
import mheader from 'components/m-header/m-header.vue'
import tab from 'components/tab/tab.vue'
import player from 'components/player/player'
export default {
  name: 'App',
  components: {
    mheader,
    tab,
    player
  }
}
</script>

<style>

</style>
