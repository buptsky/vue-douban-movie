<template>
  <div id="app">
    <keep-alive exclude="movieDetail,search,celebrity">
      <router-view @hasLoad="hasLoad"></router-view>
    </keep-alive>
    <tab></tab>
    <loading v-if="!loadingFlag"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading.vue';
  import Tab from 'components/tab/tab.vue';
  export default {
    data() {
      return {
        loadingFlag: false
      };
    },
    methods: {
      hasLoad() {
        this.loadingFlag = true;
      }
    },
    components: {
      Loading,
      Tab
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
