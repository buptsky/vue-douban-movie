import axios from 'axios';
import { commonParams } from './config';

export function getMovieDetail(id) {
  const url = `/v2/movie/subject/${id}`;
  const data = Object.assign({}, commonParams);
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}

export function getMovieReview(id) {
  const url = `/v2/movie/review/${id}`;
  const data = Object.assign({}, commonParams);
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}

export function getAllReviews(id, start, count) {
  const url = `/v2/movie/subject/${id}/reviews`;
  const data = Object.assign({}, commonParams, {
    start,
    count
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}

export function getAllComments(id, start, count) {
  const url = `/v2/movie/subject/${id}/comments`;
  const data = Object.assign({}, commonParams, {
    start,
    count
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}

// 获取影人剧照（测试版本）
// export function getCastsPhotos(id) {
//   const url = `/v2/movie/celebrity/1054395/photos`;
//   const data = Object.assign({}, commonParams);
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res.data);
//   }).catch((err) => {
//     console.log(err);
//   });
// }
