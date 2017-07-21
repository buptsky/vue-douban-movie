<template>
  <div class="loadmore" :class="{'full':fullScreen}">
    <div class="hasmore" v-if="hasMore">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="nomore" v-else>
      没有更多了...
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      hasMore: {
        type: Boolean,
        default: true
      },
      fullScreen: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        sky: 'sky'
      };
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .loadmore
    width: 150px
    height: 15px
    margin: 0 auto
    text-align: center
    padding-bottom: 10px
    &.full
      position: absolute
      top: 50%
      width: 100%
      transform: translateY(-50%)
    .hasmore
      height: 100%
      span
        display: inline-block
        width: 15px
        height: 100%
        margin-right: 5px
        background: lightgreen
        animation: load 1.04s ease infinite
        &:nth-child(1)
          animation-delay:0.13s
        &:nth-child(2)
          animation-delay:0.26s
        &:nth-child(3)
          animation-delay:0.39s
        &:nth-child(4)
          animation-delay:0.52s
        &:nth-child(5)
          animation-delay:0.65s
        &:last-child
          margin-right: 0px

  @keyframes load
    0%
      opacity: 1;
      transform: scale(1.2)
    100%
      opacity: .2;
      transform: scale(.2)


</style>
