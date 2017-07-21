<template>
  <div class="history-list">
    <ul>
      <li :key="item" @click="selectItem(item)" class="history-item" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="no-history" v-show="!searches.length">还没有搜索历史，快去搜索吧 :)</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item);
      },
      deleteOne(item) {
        this.$emit('delete', item);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .history-list
    .history-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      .text
        flex: 1
        font-size: $font-size-medium
        color: $color-text
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-f
    .no-history
      height: 40px
      line-height: 40px
      text-align: center
      font-size: $font-size-medium
</style>
