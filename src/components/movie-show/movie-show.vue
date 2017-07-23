<template>
  <div class="movie-show">
    <div class="go-search" @click="goSearch">
      <div class="logo">
        <img src="./douban-logo.png" width="35" height="35">
      </div>
      <div class="search-content">
        <span class="icon-search"></span>
        <span>电影/影人/标签</span>
      </div>
    </div>
    <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
    <div class="list-wrapper">
      <scroll v-show="currentIndex === 0"
              class="list-scroll"
              :data="hotMovies"
              :pullup="pullup"
              @scrollToEnd="loadMore"
              ref="hotMovies"
      >
        <div class="list-inner">
          <movie-list :movies="hotMovies" :hasMore="hasMoreHotMovies" @select="selectMovie"></movie-list>
        </div>
      </scroll>
      <scroll v-show="currentIndex === 1"
              class="list-scroll"
              :data="comingMovies"
              :pullup="pullup"
              :probeType="probeType"
              :listenScroll="listenScroll"
              @scroll="scroll"
              @scrollToEnd="loadMore"
              ref="comingMovies"
      >
        <div class="list-inner">
          <movie-list :movies="comingMovies" :needDate="needDate" @getHeight="getHeight" @getMap="getMap" :hasMore="hasMoreComingMovies" @select="selectMovie" ref="list"></movie-list>
        </div>
      </scroll>
      <loadmore :fullScreen="fullScreen"
                v-show="currentIndex===1&&!comingMovies.length||currentIndex===0&&!hotMovies.length">
      </loadmore>
    </div>
    <div v-show="currentIndex === 1" class="list-fixed" v-if="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches';
  import MovieList from 'components/movie-list/movie-list';
  import Scroll from 'base/scroll/scroll';
  import Loadmore from 'base/loadmore/loadmore';
  import { getMovie, getComingMovie } from '../../api/movie-show';
  import { createMovieList } from '../../common/js/movieList';
  import { mapMutations } from 'vuex';
  const SEARCH_MORE = 10; // 每次请求数据的长度
  const TITLE_HEIGHT = 30; // 日期栏高度
  export default {
    data() {
      return {
        currentIndex: 0,
        switches: [
          {name: '正在热映'},
          {name: '即将上映'}
        ],
        pullup: true, // 支持滚动加载
        needDate: true, // 电影列表显示日期栏
        fullScreen: true, // 加载动画全屏
        loadingFlag: true, // 控制滚动加载速度
        scrollY: -1,
        diff: -1,
        hotMovies: [],
        comingMovies: [],
        hasMoreHotMovies: true,
        hasMoreComingMovies: true,
        hotMovieIndex: 0,
        comingMovieIndex: 0,
        scrollIndex: 0
      };
    },
    created() {
      this._getMovie();
      this.probeType = 3; // 需要实时派发事件
      this.listenScroll = true; // 需要监听事件
      this.listHeight = []; // 各个滚动区域高度
      this.scrollMap = []; // 滚动区分组
    },
    computed: {
      fixedTitle() {
        if (this.scrollY > 0) {
          return '';
        }
        return this.scrollMap[this.scrollIndex] ? this.scrollMap[this.scrollIndex] : '';
      }
    },
    methods: {
      goSearch() { // 转入搜索页
        this.$router.push({
          path: '/search'
        });
      },
      selectMovie(movie) { // 转入电影详情
        this.setMovie(movie);
        this.$router.push({
          path: `/movie/${movie.id}`
        });
      },
      switchItem(index) { // 切换tab栏
        this.currentIndex = index;
        if (index === 1) { // 重新计算各个区间高度
          this.$refs.list.recalculate();
        }
        // 第一次切换到即将上映选项卡后开始请求即将上映电影的数据
        if (index === 1 && !this.comingMovies.length) {
          getComingMovie(this.comingMovieIndex, SEARCH_MORE).then((res) => {
            this.comingMovies = createMovieList(res.subjects); // 格式化数据，创建包含电影类的数组
            this._checkMore(res); // 检查是否还存在更多数据
          });
        }
        if (index === 1) { // 重新载入之前的滚动位置
          this.$refs.comingMovies.scrollTo(0, this.scrollY);
        }
        setTimeout(() => { // scroll组件计算高度，确保正确滚动
          this.$refs.comingMovies.refresh();
          this.$refs.hotMovies.refresh();
        }, 20);
      },
      loadMore() { // 加载更多数据
        if (!this.loadingFlag) { // 上一次加载还未完成时候，忽略此次事件
          return;
        }
        this.loadingFlag = false; // 重置加载标志位
        if (this.currentIndex === 0) { // 加载更多上映信息
          if (!this.hasMoreHotMovies) { // 不存在更多电影
            this.loadingFlag = true;
            return;
          }
          this.hotMovieIndex += SEARCH_MORE;
          getMovie(this.hotMovieIndex, SEARCH_MORE).then((res) => {
            this.hotMovies = this.hotMovies.concat(createMovieList(res.subjects));
            this._checkMore(res);
            this.loadingFlag = true;
          });
        } else {
          if (!this.hasMoreComingMovies) {
            this.loadingFlag = true;
            return;
          }
          this.comingMovieIndex += SEARCH_MORE;
          getComingMovie(this.comingMovieIndex, SEARCH_MORE).then((res) => {
            this.comingMovies = this.comingMovies.concat(createMovieList(res.subjects));
            this._checkMore(res);
            // console.log(this.comingMovies);
            this.loadingFlag = true;
          });
        }
      },
      scroll(pos) { // 获取滚动位置
        // console.log(pos);
        this.scrollY = pos.y;
      },
      getHeight(height) { // 保存子组件传入的高度列表
        this.listHeight = height;
        // console.log(height);
      },
      getMap(map) { // 保存子组件传入的日期索引
        this.scrollMap = map;
        // console.log(this.scrollMap);
      },
      _getMovie() { // 获取正在上映的电影
        getMovie(this.hotMovieIndex, SEARCH_MORE).then((res) => {
          this.$emit('hasLoad');
          this.hotMovies = createMovieList(res.subjects); // 创建movie类封装数据
          this._checkMore(res); // 检查是否还存在更多数据
        });
      },
      _checkMore(data) {
        const movies = data.subjects;
        if (!movies.length || data.start + data.count > data.total) {
          if (this.currentIndex === 0) {
            this.hasMoreHotMovies = false;
          } else {
            this.hasMoreComingMovies = false;
          }
          this.loadingFlag = true;
        }
      },
      ...mapMutations({
        setMovie: 'SET_MOVIE'
      })
    },
    watch: {
      scrollY(newY, oldY) {
        if (!newY) { // 如果在快速滚动时切换tab栏，滚动位置会读取错误，这里保留出错前正确的滚动位置
          this.scrollY = oldY;
        }
        if (this.listHeight.length === 0 || this.scrollMap.length === 0) { // 若还未获取到高度则返回
          return;
        }
        // 当滚动到顶部下拉时，newY > 0
        if (newY > 0) {
          this.scrollIndex = 0;
          return;
        }
        // 在中间部分滚动
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.scrollIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }
        // 滚动到底部，且newY大于最后一个元素的上限
        this.scrollIndex = this.listHeight.length - 2;
      },
      diff(newval) {
        let fixedTop = (newval > 0 && newval < TITLE_HEIGHT) ? newval - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
        this.$nextTick(() => {
          this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
        });
      }
    },
    components: {
      Switches,
      MovieList,
      Scroll,
      Loadmore
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .movie-show
    height: 100%
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
    .list-wrapper
      position: absolute
      top: 97px
      bottom: 61px
      width: 100%
      .list-scroll
        position: relative
        height: 100%
        overflow: hidden
        .list-inner
          padding: 0px 15px
    .list-fixed
      position: absolute
      top: 97px
      right: 15px
      left: 15px
      .fixed-title
        width: 100%
        padding-left: 5px
        height: 30px
        line-height: 30px
        background-color: $color-background-d
        // background-clip: content-box
</style>
