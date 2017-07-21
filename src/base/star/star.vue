<template>
  <div class="star" :class="starType">
    <span v-if="score || needNullStar" v-for="item in itemClasses" class="star-item" :class="item"></span>
    <span v-if="!score" class="no-score" :class="{'block':needNullStar}">暂无评分</span>
    <span v-if="showScore && score" class="show-score">{{normalizeScore}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';
  export default {
    props: {
      size: {
        type: Number,
        default: 24
      },
      score: {
        type: Number,
        default: 0
      },
      showScore: {
        type: Boolean,
        default: false
      },
      needNullStar: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      normalizeScore() { // 数位补零
        let len = this.score.toString().length;
        if (len < 2) {
          return `${this.score}.0`;
        }
        return this.score;
      },
      starType() {
        return 'star-' + this.size;
      },
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score) / 2;
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/variable.styl"
  .star
    font-size: 0
    .no-score
      font-size: $font-size-small
    .block
      display: block
      font-size: $font-size-small
      text-align: center
      padding: 15px 0 10px 0
    .show-score
      display: inline-block
      font-size: $font-size-small
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-24
      .star-item
        height: 10px
        width: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
    &.star-36
      .star-item
        height: 15px
        width: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
</style>
