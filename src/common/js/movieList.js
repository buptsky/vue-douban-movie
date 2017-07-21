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
      date: filterDate(movie.mainland_pubdate, movie.pubdates),
      pubdates: movie.pubdates
    }));
  });
  // console.log(ret);
  return ret;
};

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
  // console.log(ret);
  return ret;
};

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

function filterDirector(directors) {
  if (directors.length) {
    return directors[0].name;
  }
  return '';
};

function filterDate(date, pubdates) {
  if (new Date().getTime() > new Date(date).getTime()) { // 如果是重映电影
    return findMonth(pubdates, '中国大陆重映');
  }
  if (!date) { // 电影时间不确定，数据为空返回了undefined
    return findMonth(pubdates, '中国大陆');
  }
  return normalizeDate(date);
};

function findMonth(pubdates, key) { // 获取待定的月份
  let month = '';
  let year = '';
  pubdates.forEach((item) => {
    let index = item.indexOf(key);
    if (index > -1) {
      if (!item.split('-')[1]) {
        year = item.split('-')[0].substr(0, 4);
      } else {
        month = (item.split('-'))[1].substr(0, 2);
        // console.log(month);
        if (month.substr(0, 1) === '0') {
          month = month.substr(1, 1);
          // console.log(month);
        }
      }
    }
  });
  if (!month) {
    return `${year}年待定`;
  }
  return `${month}月待定`;
}

function needYear(date) { // 判断是否需要显示年份
  return parseInt(new Date(date).getFullYear()) > parseInt(new Date().getFullYear());
}

function normalizeDate(date) { // 格式化日期
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let currentWeek = week[new Date(date).getDay()]; // 获取当天星期
  let time = `${date.split('-')[1]}月${date.split('-')[2]}日`;
  if (time.substr(0, 1) === '0') {
    time = time.substr(1);
  }
  let ret = time + ' ' + currentWeek;
  if (needYear(date)) { // 如果不是本年度电影
    return `${date.split('-')[0]}年${ret}`;
  }
  return ret;
}
