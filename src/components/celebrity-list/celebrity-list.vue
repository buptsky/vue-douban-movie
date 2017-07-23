<template>
  <div class="celebrity-list">
    <ul>
      <li class="celebrity-item" v-for="item in celebrities" @click="selectItem(item.id,$event)">
        <div class="image">
          <img v-lazy="item.image" class="" height="100" width="70">
        </div>
        <div class="desc">
          <p class="title">{{item.name}}</p>
          <div class="works">代表作: {{item.works}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      celebrities: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(id) {
        this.$emit('select', id);
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .celebrity-item
    display: flex
    align-items: top
    box-sizing: border-box
    height: 130px
    padding: 15px
    border-bottom-1px($color-line)
    background: $color-background
    .image
      flex: 70px 0 0
      margin-right: 10px
    .desc
      flex: 1
      box-sizing: border-box
      .title
        font-size: $font-size-medium-x
        color: $color-text-f
      .works
        margin-top: 10px
        font-size: $font-size-medium
        line-height: 20px

</style>
