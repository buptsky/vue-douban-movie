<template>
  <div class="discussion-wrapper">
      <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
        <span class="type">{{title}}</span>
        <span class="to-top" @click="toTop">
        <i class="icon-circle-up"></i>
      </span>
      </div>
      <scroll class="all-discuss"
              :data="discussions"
              :pullup="pullup"
              @scrollToEnd="loadMore"
              ref="scroll"
      >
        <div class="discuss-content">
          <movie-comment
            v-if="currentDiscussionType==='comment'"
            :comments="discussions"
            :commentNum="discussionNum"
            :needTitle="needTitle"
            :hasMore="hasMore"
          >
          </movie-comment>
          <movie-review
            v-else
            :reviews="discussions"
            :reviewNum="discussionNum"
            :needTitle="needTitle"
            :hasMore="hasMore"
            @selectReview="selectReview"
          >
          </movie-review>
        </div>
        <loadmore :fullScreen="fullScreen" v-if="!discussions.length && !noResult"></loadmore>
        <div class="no-result" v-if="noResult">这里什么都没有呃 :(</div>
      </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
  import MovieComment from 'components/movie-comment/movie-comment';
  import MovieReview from 'components/movie-review/movie-review';
  import Scroll from 'base/scroll/scroll';
  import Loadmore from 'base/loadmore/loadmore';
  import { mapGetters, mapMutations } from 'vuex';
  import { getAllReviews, getAllComments } from '../../api/movie-detail';

  const SEARCH_MORE = 20;

  export default {
    data() {
      return {
        discussionIndex: 0,
        discussions: [],
        discussionNum: 0,
        pullup: true, // 支持滚动加载
        hasMore: true, // 存在更多数据
        noResult: false
      };
    },
    computed: {
      title() {
        return `${this.movie.title}的全部${this.type}`;
      },
      type() {
        return this.currentDiscussionType === 'comment' ? '短评' : '影评';
      },
      ...mapGetters([
        'currentDiscussionType',
        'movie'
      ])
    },
    created() {
      this.fullScreen = true;
      this.needTitle = true;
      this.loadingFlag = true; // 控制滚动加载速度
      this._getAllDiscussions();
    },
    methods: {
      back() {
        this.$router.back();
      },
      toTop() { // 返回顶部
        this.$refs.scroll.scrollTo(0, 0, 500);
      },
      selectReview(id) {
        this.setReview(id);
        this.$router.push({
          path: `/movie/${this.movie.id}/review/${id}`
        });
      },
      loadMore() { // 加载更多
        if (!this.loadingFlag || !this.hasMore) { // 上一次加载还未完成或没有更多数据时候，忽略此次事件
          console.log('quick');
          return;
        }
        // console.log('need more');
        this.loadingFlag = false;
        this.discussionIndex += SEARCH_MORE; // 增加查找索引
        this.getData(this.movie.id, this.discussionIndex, SEARCH_MORE).then((res) => {
          this.discussions = this.discussions.concat(res[this.discussType]);
          this._checkMore(res);
          this.loadingFlag = true;
        });
      },
      _getAllDiscussions() { // 加载初始评论, 判断应该加载评论的类型
        if (!this.currentDiscussionType) { // 当前页面浏览器刷新跳转回主页
          this.$router.push('/movie-show');
          return;
        }
        let isComment = this.currentDiscussionType === 'comment';
        this.discussType = isComment ? 'comments' : 'reviews';
        this.getData = isComment ? getAllComments : getAllReviews;
        this.getData(this.movie.id, this.discussionIndex, SEARCH_MORE).then((res) => {
          this.discussions = res[this.discussType];
          this.noResult = this.discussions.length ? this.noResult : true; // 是否存在结果
          this.discussionNum = res.total;
          this._checkMore(res); // 检查是否还存在更多数据
        });
      },
      _checkMore(data) { // 检查是否存在更多数据
        const discussions = data.comments ? data.comments : data.reviews;
        if (!discussions.length || data.start + data.count > data.total) {
          this.hasMore = false;
        }
      },
      ...mapMutations({
        setReview: 'SET_REVIEW_ID'
      })
    },
    components: {
      MovieComment,
      MovieReview,
      Scroll,
      Loadmore
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .discussion-wrapper
    height: 100%
    .fixed-title
      border-bottom-1px($color-line)
      position: fixed
      top: 0
      width: 100%
      height: 50px
      z-index: 200
      background-color: $color-background
      .back
        position: absolute
        top: 0px
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 15px
          font-size: $font-size-large
          color: $color-theme-f
      .type
        line-height: 50px
        font-size: $font-size-medium-x
        padding-left: 50px
      .to-top
        position: absolute
        top: 0
        right: 6px
        z-index: 50
        .icon-circle-up
          display: block
          padding: 15px
          font-size: $font-size-large-x
          color: $color-theme-f
    .all-discuss
      position: fixed
      top: 0
      bottom: 0
      left: 0
      right: 0
      z-index: 150
      overflow: hidden
      background-color: $color-background
      .discuss-content
        padding-top: 50px
      .no-result
        position: absolute
        top: 50%
        width: 100%
        text-align: center
</style>
