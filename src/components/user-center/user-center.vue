<template>
  <div class="user-center">
    <div class="user">
      <div class="avatar">
        <img src="./avatar.jpg" alt=""　width="60" height="60">
      </div>
      <div class="name">豆瓣用户</div>
    </div>
    <switches :switches="switches" :currentIndex="currentIndex"  @switch="switchTab"></switches>
    <scroll class="switch-item" :data="itemLists" ref="scroll">
      <div class="user-item" v-for="(item,index) in switches" v-if="index === currentIndex">
        <div class="movie-num" v-if="index !== 2">{{itemLength}} 部</div>
        <div class="movie-num" v-else>{{itemLength}} 人</div>
        <rank-list :rankItems="itemLists"
                   :needRank="needRank"
                   :needLoading="needLoading"
                   v-if="index !== 2"
                   @select="selectMovie"></rank-list>
        <celebrity-list v-else :celebrities="itemLists" @select="selectCelebrity"></celebrity-list>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches';
  import Scroll from 'base/scroll/scroll';
  import RankList from 'components/rank-list/rank-list';
  import CelebrityList from 'components/celebrity-list/celebrity-list';
  import { mapGetters, mapMutations } from 'vuex';
  export default {
    data() {
      return {
        currentIndex: 0,
        needRank: false,
        needLoading: false,
        switches: [
          {name: '想看'},
          {name: '看过'},
          {name: '影人'}
        ],
        itemLists: [],
        itemLength: 0
      };
    },
    computed: {
      ...mapGetters([
        'wantedMovies',
        'watchedMovies',
        'collectedCelebrities'
      ])
    },
    created() {
      this.itemLists = this.wantedMovies;
      this.itemLength = this.wantedMovies.length;
      this.$emit('hasLoad');
    },
    activated() { // keep-alive组件激活
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });
    },
    methods: {
      selectMovie(movie) {
        this.$router.push({
          path: `/movie/${movie.id}`
        });
        this.setMovie(movie);
      },
      selectCelebrity(id) {
        this.setCelebrity(id);
        this.$router.push({
          path: `/celebrity/${id}`
        });
      },
      switchTab(index) {
        this.currentIndex = index;
        switch (index) {
          case 0:
            this.itemLists = this.wantedMovies;
            break;
          case 1:
            this.itemLists = this.watchedMovies;
            break;
          case 2:
            this.itemLists = this.collectedCelebrities;
            break;
        }
        this.itemLength = this.itemLists.length;
        this.$nextTick(() => {
          this.$refs.scroll.scrollTo(0, 0);
          this.$refs.scroll.refresh();
        });
      },
      ...mapMutations({
        setMovie: 'SET_MOVIE',
        setCelebrity: 'SET_CELEBRITY_ID'
      })
    },
    watch: {
      watchedMovies(lists) {
        if (this.currentIndex === 1) {
          this.itemLists = lists;
          this.itemLength = lists.length;
        }
      },
      wantedMovies(lists) {
        if (this.currentIndex === 0) {
          this.itemLists = lists;
          this.itemLength = lists.length;
        }
      },
      collectedCelebrities(lists) {
        if (this.currentIndex === 2) {
          this.itemLists = lists;
          this.itemLength = lists.length;
        }
      }
    },
    components: {
      Switches,
      Scroll,
      RankList,
      CelebrityList
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .user-center
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 61px
    background-color: #f8f8f8
    overflow: hidden
    .user
      box-sizing: border-box
      width: 100%
      height: 150px
      background: linear-gradient($color-theme-f, $color-theme);
      padding: 35px 50px 35px 20px
      display: flex
      align-items: center
      .avatar
        flex: 80px 0 0
        width: 80px
        img
          border-radius: 50%
      .name
        flex: 1
        color: $color-background
        font-size: $font-size-large
    .switch-item
      position: absolute
      top: 197px
      width: 100%
      bottom: 0
      overflow: hidden
      .user-item
        .movie-num
          height: 40px
          line-height: 40px
          padding: 0 20px
          font-size: $font-size-medium
        .rank-list
          background: $color-background
        .develop
          text-align: center
          color: $color-theme-f

</style>
