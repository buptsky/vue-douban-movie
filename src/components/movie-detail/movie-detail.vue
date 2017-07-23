<template>
  <!--2017/7/22 优化-->
  <div class="detail-wrapper">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type" ref="fixed">
        <span class="icon" v-show="!this.changeFix">
          <i class="icon-video-camera"></i>
          电影
        </span>
        <span v-if="changeFix" v-text="movieDetail.title" class="movie-name"></span>
      </span>
    </div>
    <scroll class="movie-detail"
            :data="movieDetail"
            :probeType="probeType"
            :listenScroll="listenScroll"
            @scroll="scroll"
            ref="scroll"
    >
      <div class="scroll-wrapper">
        <div class="scroll-content" v-if="movieDetail.images">
          <div class="bg-image" ref="image">
            <img v-lazy="movieDetail.images.large"/>
          </div>
          <movie-info :movieDetail="movieDetail" @selectCelebrity="selectCelebrity"></movie-info>
          <div class="switch">
            <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
          </div>
          <movie-comment
            v-show="currentIndex === 0"
            :comments="movieDetail.popular_comments"
            :commentNum="movieDetail.comments_count"
            @needAllComments="needAllComments"
          ></movie-comment>
          <movie-review
            v-show="currentIndex === 1"
            :reviews="movieDetail.popular_reviews.slice(0,5)"
            :reviewNum="movieDetail.reviews_count"
            @selectReview="selectReview"
            @needAllReviews="needAllReviews"
          ></movie-review>
        </div>
      </div>
      <loadmore :fullScreen="fullScreen" v-show="!movieDetail.images"></loadmore>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import MovieInfo from 'components/movie-info/movie-info';
  import Scroll from 'base/scroll/scroll';
  import Loadmore from 'base/loadmore/loadmore';
  import Switches from 'base/switches/switches';
  import MovieComment from 'components/movie-comment/movie-comment';
  import MovieReview from 'components/movie-review/movie-review';
  import { mapGetters, mapMutations } from 'vuex';
  import { getMovieDetail } from '../../api/movie-detail';

  export default {
    name: 'movieDetail', // 创建name属性用于keep-alive组件定位本组件防止缓存
    created() {
      this.probeType = 3; // scroll组件需要实施派发scroll事件，且支持swipe
      this.listenScroll = true; // scroll组件监听scroll事件并派发滚动位置
      this._getDetail(); // 获取电影详细信息
    },
    data() {
      return {
        movieDetail: {},
        fullScreen: true, // 用于loadmore组件全屏加载效果
        switches: [
          {name: '短评'},
          {name: '影评'}
        ],
        currentIndex: 0,
        scrollY: -1,
        imgHeight: -1,
        changeFix: false // fix栏目图标的显示隐藏
      };
    },
    computed: {
      ...mapGetters([
        'movie'
      ])
    },
    methods: {
      back() { // 回退到上一页面
        this.$router.back();
      },
      switchItem(index) { // 切换评论tab栏目
        this.currentIndex = index;
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      selectCelebrity(id) { // 选取影人
        this.setCelebrity(id);
        this.$router.push({
          path: `/celebrity/${id}`
        });
      },
      selectReview(id) {
        this.setReview(id);
        this.$router.push({
          path: `/movie/${this.movieDetail.id}/review/${id}`
        });
      },
      needAllComments() { // 转入全部短评界面
        this.setDiscussion('comment'); // 提交mutation
        this.$router.push({
          path: `/movie/${this.movieDetail.id}/comments`
        });
      },
      needAllReviews() { // 转入全部长评界面
        this.setDiscussion('review'); // 提交mutation
        this.$router.push({
          path: `/movie/${this.movieDetail.id}/reviews`
        });
      },
      scroll(pos) { // 获取页面滚动位置
        this.scrollY = pos.y;
        if (-this.imgHeight > pos.y && this.imgHeight !== -1) {
          this.changeFix = true; // 改变fixed栏文字
        } else {
          this.changeFix = false;
        }
      },
      _getDetail() {
        if (!this.movie.id) { // 在当前界面刷新回退到主界面
          this.$router.push('/movie-show');
          return;
        }
        getMovieDetail(this.movie.id).then((res) => { // 获取电影详细
          if (!this.$route.params.movieId) { // 防止快速切换报错
            return;
          }
          this.movieDetail = res;
          let me = this;
          // 使用vue-lazyload监听事件，每次进入只触发一次
          this.$Lazyload.$once('loaded', function ({ el, src }) {
            if (src === res.images.large) {
              me.imgHeight = me._getImageHeight();
              setTimeout(() => {
                if (!me.$route.params.movieId) { // 防止路由快速切换报错
                  return;
                }
                me.$refs.scroll.refresh(); // scroll组件重新计算高度
              }, 20);
            }
          });
        });
      },
      _getImageHeight() {
        // 获取电影海报高度,用于fixed栏固定
        return this.$refs.image.clientHeight;
      },
      ...mapMutations({
        setReview: 'SET_REVIEW_ID',
        setDiscussion: 'SET_DISCUSSION_TYPE',
        setCelebrity: 'SET_CELEBRITY_ID'
      })
    },
    components: {
      MovieInfo,
      Scroll,
      Loadmore,
      Switches,
      MovieComment,
      MovieReview
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  .detail-wrapper
    position: relative
    z-index: 10
    .fixed-title
      position: fixed
      top: 0
      width: 100%
      height: 40px
      z-index: 100
      background-color: rgba(85, 85, 85, .6)
      text-align: center
      .back
        position: absolute
        top: 0px
        left: 6px
        z-index: 50
        .icon-back
          display: block
          padding: 10px
          font-size: $font-size-large
          color: $color-background
      .type
        .icon
          position: absolute
          left: 50%
          top: 0
          color: $color-background
          display: block
          padding: 10px
          transform: translateX(-50%)
          .icon-video-camera
            display: inline-block
            vertical-align: text-bottom
            font-size: $font-size-large-x
        .movie-name
          display: block
          padding-top: 11px
          width: 100%
          color: $color-background
    .movie-detail
      position: fixed
      top: 0
      bottom: 0
      left: 0
      right: 0
      background: $color-background-f
      .bg-image
        text-align: center
        padding: 50px 0 20px 0
        background-color: $color-background-f
        img
          width: 50%
      .switch
        padding: 0 20px
        background-color: $color-background
        padding-top: 20px
</style>
