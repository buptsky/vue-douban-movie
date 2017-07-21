import { loadSearch, loadComment, loadWatchedMovie, loadWantedMovie, loadCelebrity } from '../common/js/cache';
const state = {
  movie: {}, // 当前电影信息
  currentCelebrityId: 0,
  currentReviewId: 0,
  currentDiscussionType: '',
  searchHistory: loadSearch(), // 搜索历史,每次刷新从缓存中读取
  watchedMovies: loadWatchedMovie(), // 看过的电影
  wantedMovies: loadWantedMovie(), // 想看的电影
  collectedCelebrities: loadCelebrity(), // 收藏的影人
  favoriteComments: loadComment() // 点赞的评论
};

export default state;
