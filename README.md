# vue2.0 豆瓣电影WebApp

## 项目简介

使用vue2.0仿豆瓣电影app，根据豆瓣电影api对功能作了适当修改

api来源自豆瓣官方api，详情请戳[豆瓣电影api](https://developers.douban.com/wiki/?title=movie_v2)

>  如果对您有帮助，可以点右上角 "Star" 支持一下 谢谢！ ^_^

## 线上体验

后续添加

## 项目运行

clone项目源码
```
git clone https://github.com/buptsky/vue-douban-movie.git
```
安装依赖
```
cd vue-douban-movie
npm install
``` 
运行
```
npm run dev
```
打开浏览器进入localhost:8000，在开发者工具的移动端模式下查看效果

## 部分效果演示
### 上映电影信息和电影详情

![image](https://github.com/buptsky/vue-douban-movie/raw/master/screenshots/move-show.gif)
![image](https://github.com/buptsky/vue-douban-movie/raw/master/screenshots/detail.gif)

### 排行和影人

![image](https://github.com/buptsky/vue-douban-movie/raw/master/screenshots/rank.gif)
![image](https://github.com/buptsky/vue-douban-movie/raw/master/screenshots/celebrity.gif)

### 搜索和收藏

![image](https://github.com/buptsky/vue-douban-movie/raw/master/screenshots/search.gif)
![image](https://github.com/buptsky/vue-douban-movie/raw/master/screenshots/collect.gif)

## 项目描述
### 技术栈
- vue2.0 + vue-router + vuex：vue全家桶
- axios：用于ajax请求
- vue-lazyload：用于图片懒加载
- better-scroll：移动端滚动库，优化移动端滚动效果
- webpack： 构建工具
- es6: 使用es6语法
- stylus: css预处理

使用flex布局进行移动端适配，用eslint进行代码规范检查

webpack + webpack-dev-server + http-proxy-middleware进行本地开发环境http请求转发，实现跨域请求

线上使用express的http-proxy-middleware实现请求转发
