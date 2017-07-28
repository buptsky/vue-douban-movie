// 创建电影类
export default class Movie {
  constructor({id, title, director, casts, collectCount, rating, image, date, pubdates, subtype}) {
    this.id = id;
    this.title = title;
    this.director = director;
    this.casts = casts;
    this.collectCount = collectCount || 0;
    this.rating = rating;
    this.image = image;
    this.date = date || ''; // 用于显示即将上映的电影是否待定
    this.pubdates = pubdates || ''; // 用于电影详情的上映日期
    this.subtype = subtype || ' ';
  }
};
// 创建包含电影类的通用电影信息列表
export function createMovieList(movieList) {
  let ret = [];
  movieList.forEach((movie, index) => {
    ret.push(new Movie({
      id: movie.id,
      title: movie.title,
      director: filterDirector(movie.directors),
      casts: filterCasts(movie.casts),
      collectCount: movie.collect_count,
      rating: movie.rating.average,
      image: movie.images.large,
      date: filterDate(movie.mainland_pubdate, movie.pubdates), // 该条目只用于首页热映电影和即将上映电影
      pubdates: movie.pubdates
    }));
  });
  return ret;
};
// 创建包含电影类的适合排行榜的电影信息列表
export function createRankList(rankList) {
  let ret = [];
  rankList.forEach((item) => {
    item = item.subject ? item.subject : item;
    ret.push(new Movie({
      id: item.id,
      title: item.title,
      director: filterDirector(item.directors),
      casts: filterCasts(item.casts),
      rating: item.rating.average,
      image: item.images.large
    }));
  });
  return ret;
};
// 创建包含电影类的适合搜索结果的电影信息列表
export function createSearchList(movieList) {
  let ret = [];
  movieList.forEach((movie, index) => {
    ret.push(new Movie({
      id: movie.id,
      title: movie.title,
      director: filterDirector(movie.directors),
      casts: filterCasts(movie.casts),
      rating: movie.rating.average,
      image: movie.images.small,
      pubdates: movie.pubdates,
      subtype: movie.subtype
    }));
  });
  return ret;
};
// 预处理演员信息
function filterCasts(casts) {
  let ret = '';
  casts.forEach((item, index) => {
    if (index < casts.length - 1) {
      ret += `${item.name}/`;
    } else {
      ret += item.name;
    }
  });
  return ret;
};
// 预处理导演信息，只获取主导演
function filterDirector(directors) {
  return directors.length ? directors[0].name : '';
};
// 预处理时间信息
function filterDate(date, pubdates) {
  // 在上映电影列表中出现重映电影的情况
  if (new Date().getTime() > new Date(date).getTime()) { // 如果是重映电影
    // 判断该重映电影是否为待定日期
    let reg = /^\d{4}[-]\d{2}[-]\d{2}/;
    for (let i = 0; i < pubdates.length; i++) {
      // 如果重映电影的日期数据完整，不需要待定显示
      if (pubdates[i].indexOf('中国大陆重映') !== -1 && reg.test(pubdates[i])) {
        return normalizeDate(pubdates[i].match(reg)[0]);
      }
    }
    return findShowTime(pubdates, '中国大陆重映');
  }
  if (!date) { // 电影时间不确定，数据为空返回了undefined
    return findShowTime(pubdates, '中国大陆');
  }
  return normalizeDate(date);
};
// 获取电影上映的待定时间
function findShowTime(pubdates, key) { // 获取待定的月份或年份
  let month = '';
  let year = '';
  pubdates.forEach((item) => {
    let index = item.indexOf(key);
    if (index > -1) {
      if (!item.split('-')[1]) { // 不存在月份信息
        year = item.split('-')[0].substr(0, 4);
      } else {
        month = (item.split('-'))[1].substr(0, 2);
        if (month.substr(0, 1) === '0') { // 月份去零
          month = month.substr(1, 1);
        }
      }
    }
  });
  if (!month) {
    return `${year}年待定`;
  }
  return `${month}月待定`;
}
// 判断是否需要显示年份
function needYear(date) {
  return parseInt(new Date(date).getFullYear()) > parseInt(new Date().getFullYear());
}
// 格式化日期
function normalizeDate(date) {
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let currentWeek = week[new Date(date).getDay()]; // 获取当天星期
  let time = `${date.split('-')[1]}月${date.split('-')[2]}日`;
  if (time.substr(0, 1) === '0') { // 月份去零
    time = time.substr(1);
  }
  let ret = time + ' ' + currentWeek;
  if (needYear(date)) { // 如果不是本年度电影
    return `${date.split('-')[0]}年${ret}`;
  }
  return ret;
}
