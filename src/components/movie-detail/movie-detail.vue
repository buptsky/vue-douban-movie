<template>
  <div class="detail-wrapper">
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-arrow_lift"></i>
      </span>
      <span class="type" ref="fixed">
        <span class="icon" v-show="!this.changeFix">
          <i class="icon-video-camera"></i>
          电影
        </span>
        <span v-if="changeFix" v-text="movieDetail[0].title" class="movie-name"></span>
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
        <div class="scroll-content" v-for="detail in movieDetail">
          <div class="bg-image" ref="image">
            <!--<img v-lazy="detail.images.large"/>-->
            <img v-lazy="detail.images.large"/>
          </div>
          <movie-info :movieDetail="detail" @selectCelebrity="selectCelebrity"></movie-info>
          <div class="switch">
            <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
          </div>
          <movie-comment
            v-show="currentIndex === 0"
            :comments="detail.popular_comments"
            :commentNum="detail.comments_count"
            @needAllComments="needAllComments"
          ></movie-comment>
          <movie-review
            :reviews="detail.popular_reviews.slice(0,5)"
            :reviewNum="detail.reviews_count"
            v-show="currentIndex === 1"
            @selectReview="selectReview"
            @needAllReviews="needAllReviews"
          ></movie-review>
        </div>
      </div>
      <loadmore :fullScreen="fullScreen" v-show="!movieDetail.length"></loadmore>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex';
  import { getMovieDetail } from '../../api/movie-detail';
  import MovieInfo from 'components/movie-info/movie-info';
  import Scroll from 'base/scroll/scroll';
  import Loadmore from 'base/loadmore/loadmore';
  import Switches from 'base/switches/switches';
  import MovieComment from 'components/movie-comment/movie-comment';
  import MovieReview from 'components/movie-review/movie-review';
  export default {
    name: 'movieDetail',
    created() {
      this.probeType = 3;
      this.listenScroll = true;
      this._getDetail();
    },
    data() {
      return {
        movieDetail: [],
        fullScreen: true,
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
      switchItem(index) {
        this.currentIndex = index;
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      },
      selectCelebrity(id) {
        this.setCelebrity(id);
        this.$router.push({
          path: `/celebrity/${id}`
        });
      },
      selectReview(id) {
        this.$router.push({
          path: `/movie/${this.movieDetail[0].id}/review/${id}`
        });
        this.setReview(id);
      },
      needAllComments() { // 转入全部短评界面
        this.$router.push({
          path: `/movie/${this.movieDetail[0].id}/comments`
        });
        this.setDiscussion('comment');
      },
      needAllReviews() { // 转入全部长评界面
        this.$router.push({
          path: `/movie/${this.movieDetail[0].id}/reviews`
        });
        this.setDiscussion('review');
      },
      scroll(pos) {
        this.scrollY = pos.y;
        if (-this.imgHeight > pos.y && this.imgHeight !== -1) {
          this.changeFix = true;
        } else {
          this.changeFix = false;
        }
      },
      _getDetail() {
        if (!this.movie.id) {
          this.$router.push('/movie-show');
          return;
        }
        getMovieDetail(this.movie.id).then((res) => {
          if (!this.$route.params.movieId) { // 防止快速切换报错
            return;
          }
          this.movieDetail = [res];
          let me = this;
          // 使用lazyload监听事件，每次进入只触发一次
          this.$Lazyload.$once('loaded', function ({ el, src }) {
            if (src === res.images.large) {
              me.imgHeight = me._getImageHeight();
              setTimeout(() => {
                if (!me.$route.params.movieId) { // 防止快速切换报错
                  return;
                }
                me.$refs.scroll.refresh(); // 重新计算高度
              }, 20);
            }
          });
//          使用原生方法进行懒加载处理
//          加载后处理，防止获取不到
//          let img = new Image();
//          let me = this;
//          img.onload = function() {
//            img.style.width = '50%';
//            me.$refs.image[0].appendChild(img);
//            me.imgHeight = me._getImageHeight();
//            // console.log(me.imgHeight);
//            setTimeout(() => {
//              me.$refs.scroll.refresh(); // 重新计算高度
//            }, 20);
//          };
//          img.src = res.images.large;
        });
      },
      _getImageHeight() {
//        console.log(this.$refs.image[0].clientHeight);
        return this.$refs.image[0].clientHeight;
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
        .icon-arrow_lift
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
