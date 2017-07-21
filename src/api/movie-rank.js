import axios from 'axios';
import { commonParams } from './config';

export function top250Rank(start, count) { // top250
  const url = '/v2/movie/top250';
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

export function usBoxRank() { // 北美票房
  const url = '/v2/movie/us_box';
  const data = Object.assign({}, commonParams);
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}

export function weeklyRank() { // 口碑榜
  const url = '/v2/movie/weekly';
  const data = Object.assign({}, commonParams);
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}

export function newMoviesRank() { // 新片榜
  const url = '/v2/movie/new_movies';
  const data = Object.assign({}, commonParams);
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  }).catch((err) => {
    console.log(err);
  });
}
