<template>
  <div class="rank">
    <div class="go-search" @click="goSearch">
      <div class="logo">
        <img src="./douban-logo.png" width="35" height="35">
      </div>
      <div class="search-content">
        <span class="icon-search"></span>
        <span>电影/影人/标签</span>
      </div>
    </div>
    <scroll class="rank-list" :data="urlList" ref="scroll">
      <div class="scroll-wrapper">
        <div class="scroll-content" v-if="hasLoad" >
          <h1 class="title">精选榜单</h1>
          <router-link tag="div" to="/rank/top250" class="top250 rank-item">
            <div class="desc">
              <h2 class="name">豆瓣 Top250</h2>
              <span class="brief">8分以上好电影</span>
            </div>
            <div class="rank-img">
              <img v-for="(item,index) in urlList[0]" :src="replaceUrl(item)" :class="{'top': index === 1 }"/>
            </div>
          </router-link>
          <router-link tag="div" to="/rank/weekly" class="weekly rank-item">
            <div class="desc">
              <h2 class="name">本周口碑榜</h2>
              <span class="brief">{{weekDate}}</span>
            </div>
            <div class="rank-img">
              <img v-for="(item,index) in urlList[1]" :src="replaceUrl(item)" :class="{'top': index === 1 }"/>
            </div>
          </router-link>
          <router-link tag="div" to="/rank/new-movie" class="new-movie rank-item">
            <div class="desc">
              <h2 class="name">新片榜</h2>
              <span class="brief">{{weekDate}}</span>
            </div>
            <div class="rank-img">
              <img v-for="(item,index) in urlList[2]" :src="replaceUrl(item)" :class="{'top': index === 1 }"/>
            </div>
          </router-link>
          <router-link tag="div" to="/rank/us-box" class="us-box rank-item">
            <div class="desc">
              <h2 class="name">北美票房榜</h2>
              <span class="brief">票房最高排名</span>
            </div>
            <div class="rank-img">
              <img v-for="(item,index) in urlList[3]" :src="replaceUrl(item)" :class="{'top': index === 1 }"/>
            </div>
          </router-link>
        </div>
      </div>
    </scroll>
    <loadmore :fullScreen="fullScreen" v-if="!hasLoad"></loadmore>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loadmore from 'base/loadmore/loadmore';
  import Scroll from 'base/scroll/scroll';
  import WeekDate from '../../common/js/date';
  import { top250Rank, usBoxRank, weeklyRank, newMoviesRank } from '../../api/movie-rank';
  export default {
    data() {
      return {
        weekDate: '',
        hasLoad: false,
        fullScreen: true,
        rankImgUrl: [],
        urlList: []
      };
    },
    computed: {
      rankList() {
        this.urlList.forEach((item) => {
          let url = item[1];
          item[1] = item[2];
          item[2] = url;
        });
      }
    },
    created() {
      this._getWeekDate();
      this._getBriefRank();
    },
    activated() { // keep-alive组件激活
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });
    },
    methods: {
      goSearch() {
        this.$router.push({
          path: '/search'
        });
      },
      replaceUrl(srcUrl) {
        if (srcUrl !== undefined) { // 图片防盗链处理
          return ('https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, ''));
        }
      },
      getUrlList(url) { // 获取处理过的图片集合，各个排行榜数据结构不一致需要处理
        let list = [];
        url.forEach((item, index) => {
          let subject = item.subjects.slice(0, 3);
          list[index] = [];
          subject.forEach((item) => {
            list[index].push(item.subject ? item.subject.images.medium : item.images.medium);
          });
        });
        // console.log(list);
        list.forEach((item) => { // 将第二名排到第一位
          let url = item[0];
          item[0] = item[1];
          item[1] = url;
        });
        this.urlList = list;
      },
      _getWeekDate() { // 获取排行榜当前周次起始日期
        let date = new WeekDate();
        this.weekDate = date.getWeekStartDate() + ' - ' + date.getWeekEndDate();
      },
      _getBriefRank() {
        Promise.all([top250Rank(0, 3), usBoxRank(), weeklyRank(), newMoviesRank()]).then((res) => {
//          this.rankImgUrl = res;
          this.$emit('hasLoad');
          this.hasLoad = true;
          this.getUrlList(res);
        });
      }
    },
    components: {
      Loadmore,
      Scroll
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .rank
    .go-search
      height: 50px
      box-sizing: border-box
      padding: 10px 10px 5px 60px
      text-align: center
      .logo
        position: absolute
        left: 10px
      .search-content
        background-color: $color-background-d
        font-size: $font-size-medium-x
        line-height: 35px
        border-radius: 5px
        span
          display: inline-block
          vertical-align: middle
    .rank-list
      position: fixed
      top: 50px
      left: 0
      right: 0
      bottom: 62px
      padding: 0 15px
      overflow: hidden
      .title
        color: $color-text-f
      .scroll-content
        padding: 20px 0
      .rank-item
        margin-top: 15px
        height: 130px
        border-radius: 10px
        color: $color-background
        .desc
          vertical-align: top
          display: inline-block
          box-sizing: border-box
          padding-top: 50px
          width: 40%
          height: 100%
          text-align: center
          .name
            font-size: $font-size-large
          .brief
            font-size: $font-size-small
        .rank-img
          vertical-align: top
          display: inline-block
          width: 55%
          height: 100%
          text-align: center
          img
            display: inline-block
            vertical-align: text-top
            position: relative
            top: 50%
            transform: translateY(-50%)
            width: 30%
            &.top
              width: 35%
      .top250
        background: linear-gradient(#E1A708,#EFD491)
      .weekly
        background: linear-gradient(#32C05E,#A1E5BE)
      .new-movie
        background: linear-gradient(#A361C3,#D9B9E8)
      .us-box
        background: linear-gradient(#DD7286,#F3B9C5)

</style>
