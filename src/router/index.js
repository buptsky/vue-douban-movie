import Vue from 'vue';
import Router from 'vue-router';

const MovieShow = resolve => require(['components/movie-show/movie-show'], resolve);
const Rank = resolve => require(['components/rank/rank'], resolve);
const RankDetail = resolve => require(['components/rank-detail/rank-detail'], resolve);
const UserCenter = resolve => require(['components/user-center/user-center'], resolve);
const MovieDetail = resolve => require(['components/movie-detail/movie-detail'], resolve);
const ReviewDetail = resolve => require(['components/review-detail/review-detail'], resolve);
const AllDiscussion = resolve => require(['components/all-discussion/all-discussion'], resolve);
const Search = resolve => require(['components/search/search'], resolve);
const CelebrityDetail = resolve => require(['components/celebrity-detail/celebrity-detail'], resolve);
const CelebrityWorks = resolve => require(['components/celebrity-works/celebrity-works'], resolve);

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/movie-show'
    },
    {
      path: '/movie-show',
      component: MovieShow
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':rankType',
          component: RankDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/movie/:movieId',
      component: MovieDetail,
      children: [
        {
          path: 'review/:reviewId',
          component: ReviewDetail
        },
        {
          path: ':discussType',
          component: AllDiscussion
        }
      ]
    },
    {
      path: '/celebrity/:celebrityId',
      component: CelebrityDetail,
      children: [
        {
          path: 'works',
          component: CelebrityWorks
        }
      ]
    }
  ],
  mode: 'history'
});
