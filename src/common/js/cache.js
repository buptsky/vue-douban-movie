import { saveToLocal, loadFromLocal } from './store';
const USER_ID = 'buptsky';
const SEARCH_KEY = '__search__'; // 搜索历史键名
const COMMENT_KEY = '__comment__'; // 搜索历史键名
const WATCHED_KEY = '__watched__'; // 已经看过的电影
const WANTED_KEY = '__wanted__'; // 想看的电影
const CELEBRITY_KEY = '__celebrity__'; // 收藏的影人
const SEARCH_MAX_LENGTH = 20;
const COMMENT_MAX_LENGTH = 300;
const WATCHED_MAX_LENGTH = 300;
const WANTED_MAX_LENGTH = 300;
const CELEBRITY_MAX_LENGTH = 300;
/*
*搜索历史部分
*/

// 保存搜索结果
export function saveSearch(query) {
  let searches = loadFromLocal(USER_ID, SEARCH_KEY, []); // 获取不到返回空数组
  insertArray(searches, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LENGTH);
  saveToLocal(USER_ID, SEARCH_KEY, searches); // 存入缓存
  return searches;
}
// 从缓存中读取
export function loadSearch() {
  return loadFromLocal(USER_ID, SEARCH_KEY, []);
}
// 从缓存中删除
export function deleteSearch(query) {
  let searches = loadFromLocal(USER_ID, SEARCH_KEY, []); // 获取不到返回空数组
  deleteFromArray(searches, (item) => {
    return item === query;
  });
  saveToLocal(USER_ID, SEARCH_KEY, searches); // 存入缓存
  return searches;
}
// 删除全部缓存
export function clearSearch() {
  saveToLocal(USER_ID, SEARCH_KEY, []); // 存入缓存;
  return [];
}

/*
* 收藏评论部分
*/

// 保存标记结果
export function saveComment(id) {
  const maxLen = COMMENT_MAX_LENGTH;
  let comments = loadFromLocal(USER_ID, COMMENT_KEY, []); // 获取不到返回空数组
  // 查找缓存数组中是否包含添加的数据，返回索引
  const index = comments.findIndex((item) => {
    return item === id;
  });
  if (index === -1) {
    comments.push(id);
    // 超过最大长度时移除起始数据
    if (maxLen && comments.length > maxLen) {
      comments.shift();
    }
  } else { // 若已经存在了被标记的id，则代表用户进行了反操作，取消了喜欢
    comments.splice(index, 1);
  }
  saveToLocal(USER_ID, COMMENT_KEY, comments); // 存入缓存
  return comments;
}
// 从缓存中读取
export function loadComment() {
  return loadFromLocal(USER_ID, COMMENT_KEY, []);
}

/*
* 看过的电影
*/

// 保存标记结果
export function saveWatchedMovie(movie) {
  const maxLen = WATCHED_MAX_LENGTH;
  let movies = loadFromLocal(USER_ID, WATCHED_KEY, []); // 获取不到返回空数组
  // 查找缓存数组中是否包含添加的数据，返回索引
  const index = movies.findIndex((item) => {
    return item.id === movie.id;
  });
  if (index === -1) {
    movies.push(movie);
    // 超过最大长度时移除起始数据
    if (maxLen && movies.length > maxLen) {
      movies.shift();
    }
  } else { // 若已经存在了被标记的id，则代表用户进行了反操作，取消了喜欢
    movies.splice(index, 1);
  }
  saveToLocal(USER_ID, WATCHED_KEY, movies); // 存入缓存
  return movies;
}
// 从缓存中读取
export function loadWatchedMovie() {
  return loadFromLocal(USER_ID, WATCHED_KEY, []);
}

/*
* 想看的电影
*/

// 保存标记结果
export function saveWantedMovie(movie) {
  const maxLen = WANTED_MAX_LENGTH;
  let movies = loadFromLocal(USER_ID, WANTED_KEY, []); // 获取不到返回空数组
  // 查找缓存数组中是否包含添加的数据，返回索引
  const index = movies.findIndex((item) => {
    return item.id === movie.id;
  });
  if (index === -1) {
    movies.push(movie);
    // 超过最大长度时移除起始数据
    if (maxLen && movies.length > maxLen) {
      movies.shift();
    }
  } else { // 若已经存在了被标记的id，则代表用户进行了反操作，取消了喜欢
    movies.splice(index, 1);
  }
  saveToLocal(USER_ID, WANTED_KEY, movies); // 存入缓存
  return movies;
}
// 从缓存中读取
export function loadWantedMovie() {
  return loadFromLocal(USER_ID, WANTED_KEY, []);
}

/*
* 收藏的影人
*/

// 保存标记结果
export function saveCelebrity(celebrity) {
  const maxLen = CELEBRITY_MAX_LENGTH;
  let celebrities = loadFromLocal(USER_ID, CELEBRITY_KEY, []); // 获取不到返回空数组
  // 查找缓存数组中是否包含添加的数据，返回索引
  const index = celebrities.findIndex((item) => {
    return item.id === celebrity.id;
  });
  if (index === -1) {
    celebrities.push(celebrity);
    // 超过最大长度时移除起始数据
    if (maxLen && celebrities.length > maxLen) {
      celebrities.shift();
    }
  } else { // 若已经存在了被标记的id，则代表用户进行了反操作，取消了喜欢
    celebrities.splice(index, 1);
  }
  saveToLocal(USER_ID, CELEBRITY_KEY, celebrities); // 存入缓存
  return celebrities;
}
// 从缓存中读取
export function loadCelebrity() {
  return loadFromLocal(USER_ID, CELEBRITY_KEY, []);
}

/*
*通用方法
*/
// 将信息插入缓存数组
function insertArray(arr, val, compare, maxLen) {
  // 查找缓存数组中是否包含添加的数据，返回索引
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  // 将新数据添加到最前面
  arr.unshift(val);
  // 超过最大长度时移除末尾数据
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}
// 将信息从缓存数组中删除
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
