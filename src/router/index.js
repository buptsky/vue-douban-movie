import Vue from 'vue';
import Router from 'vue-router';
import MovieShow from 'components/movie-show/movie-show';
import Rank from 'components/rank/rank';
import RankDetail from 'components/rank-detail/rank-detail';
import UserCenter from 'components/user-center/user-center';
import MovieDetail from 'components/movie-detail/movie-detail';
import ReviewDetail from 'components/review-detail/review-detail';
import AllDiscussion from 'components/all-discussion/all-discussion';
import Search from 'components/search/search';
import CelebrityDetail from 'components/celebrity-detail/celebrity-detail';
import CelebrityWorks from 'components/celebrity-works/celebrity-works';

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
