<template>
  <div class="suggest-wrapper">
    <div class="to-top" @click="toTop" v-show="result.length">
      <span>返回顶部</span>
    </div>
    <scroll class="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" @beforeScroll="listScroll" @scrollToEnd="searchMore"　ref="suggest">
      <ul class="suggest-list">
        <li class="suggest-item" v-for="item in result" v-if="item.subtype !== 'tv'" @click="selectItem(item)">
          <div class="item-pic">
            <img :src="replaceUrl(item.image)" width="50" height="70">
          </div>
          <div class="item-info">
            <div class="title">{{item.title}}</div>
            <div class="info">
              <span class="rating">{{getRating(item.rating)}}</span>
              <span class="pubdate">{{getPubdate(item.pubdates)}}</span>
            </div>
          </div>
        </li>
        <loadmore :hasMore="hasMore" v-if="result.length"></loadmore>
      </ul>
      <div class="no-result" v-if="noResult">抱歉，暂无搜索结果 :(</div>
      <loadmore :fullScreen="fullScreen" v-if="!result.length && !noResult"></loadmore>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import Loadmore from 'base/loadmore/loadmore';
  import { movieSearch, tagSearch } from '../../api/movie-search';
  import { createSearchList } from '../../common/js/movieList';
  import { mapMutations } from 'vuex';
  const SEARCH_MORE = 20;
  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      tagSearch: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        searchIndex: 0,
        result: [],
        pullup: true,
        hasMore: true,
        beforeScroll: true,
        loadingFlag: true,
        fullScreen: true,
        dataFn: null,
        noResult: false
      };
    },
    created() {
      this._selectType();
    },
    methods: {
      toTop() {
        this.$refs.suggest.scrollTo(0, 0, 200);
      },
      search() {
        // 首先需要重置一些状态
        this.result = [];
        this.hasMore = true;
        this.loadingFlag = true;
        this.searchIndex = 0; // 变更搜索内容时重置
        this.$refs.suggest.scrollTo(0, 0); // 回滚到顶部
        this.dataFn(this.query, this.searchIndex, SEARCH_MORE).then((res) => {
          const queryRet = res.title.split('"');
          if (this.query !== queryRet[1]) { // 防止由于加载缓慢，之前废弃的数据篡改当前数据
            console.log('old request + 1', queryRet[1]);
            return; // 舍弃过时的请求
          }
          if (!res.subjects.length) { // 判断是否存在搜索结果
            this.noResult = true;
          } else {
            this.noResult = false;
          }
          this.result = createSearchList(res.subjects);
          this._checkMore(res);
          // console.log(this.result);
        });
      },
      searchMore() {
        if (!this.loadingFlag) { // 上一次加载还未完成时候，忽略此次事件
          return;
        }
        this.loadingFlag = false;
        if (!this.hasMore) {
          return;
        }
        this.searchIndex += SEARCH_MORE;
        console.log('need more');
        this.dataFn(this.query, this.searchIndex, SEARCH_MORE).then((res) => {
          this.result = this.result.concat(createSearchList(res.subjects));
          this._checkMore(res);
          this.loadingFlag = true;
        });
      },
      getPubdate(date) {
        let pubdate = '';
        for (let i = 0; i < date.length; i++) {
          if (date[i].indexOf('电影节') === -1) {
            pubdate = date[i]; // 没有在中国大陆上映，取不为电影节的最后一个信息
          }
          if (date[i].indexOf('中国大陆') > -1) {
            pubdate = date[i];
            break;
          }
        }
        if (!pubdate) {
          return '';
        }
        return '/' + pubdate;
      },
      getRating(rate) {
        if (rate === 0) {
          return '暂无评分';
        }
        return rate + '分';
      },
      selectItem(item) {
        // 点击搜索结果跳转
        this.$router.push({
          path: `/movie/${item.id}`
        });
        this.setMovie(item);
        this.$emit('select'); // 派发事件用于更改搜索历史
      },
      listScroll() { // 移动端搜索时，键盘防遮挡
        this.$emit('listScroll');
      },
      replaceUrl(srcUrl) {
        if (srcUrl !== undefined) { // 图片防盗链处理
          return ('https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, ''));
        }
      },
      _checkMore(data) {
        let movies = data.subjects;
        if (!movies.length || data.start + data.count >= data.total) {
          this.hasMore = false;
        }
      },
      _selectType() {
        this.dataFn = this.tagSearch ? tagSearch : movieSearch;
      },
      ...mapMutations({
        'setMovie': 'SET_MOVIE'
      })
    },
    watch: {
      query() {
        this._selectType();
        if (this.query) { // 搜索框有数据
          this.result = []; // 清空数据
          this.search(); // 获得检索数据
        }
      }
    },
    components: {
      Scroll,
      Loadmore
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .suggest-wrapper
    height: 100%
    .to-top
      box-sizing: border-box
      height: 22px
      position: fixed
      right: 0
      top: 80%
      z-index: 800
      padding: 5px
      background: $color-theme-f
      color: $color-background
      text-align: center
      font-size: $font-size-small
    .suggest
      height: 100%
      overflow: hidden
      .suggest-list
        padding: 15px
        .suggest-item
          margin-top: 15px
          height: 70px
          display: flex
          &:first-child
            margin-top: 0
          .item-pic
            flex: 50px 0 0
            width: 50px
            margin-right: 10px
          .item-info
            flex: 1
            padding-bottom: 30px
            .title
              font-size: $font-size-medium
              color: $color-text-f
              margin-bottom: 10px
            .info
              font-size: 0
              span
                font-size: $font-size-small
      .no-result
        position: absolute
        top: 50%
        width: 100%
        text-align: center
</style>
