# vue2.0 豆瓣电影WebApp

## 项目简介

使用vue2.0仿豆瓣电影app，根据豆瓣电影api对功能作了适当修改

api来源自豆瓣官方api，详情请戳[豆瓣电影api](https://developers.douban.com/wiki/?title=movie_v2)

>  如果对您有帮助，可以点右上角 "Star" 支持一下 谢谢！ ^_^

## 线上体验

#### PC访问

[豆瓣电影webapp](http://59.110.140.119:8080)

打开浏览器进入开发者模式，选择移动端视口

chrome浏览器下的iphone5/6/6 plus体验效果更佳

#### 移动端访问

打开手机浏览器扫描下方二维码或访问上面的地址，推荐全屏模式下体验

![image](https://github.com/buptsky/vue-douban-movie/raw/master/screenshots/qrcode.png)

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

#### 运行环境
node 6+ npm 4+


## 部分效果演示
### 上映电影信息和电影详情

![image](https://github.com/buptsky/vue-douban-movie/raw/master/screenshots/movie-show.gif)
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

使用localStorage存储收藏的电影信息，影人信息，评论点赞信息

webpack + webpack-dev-server + http-proxy-middleware进行本地开发环境http请求转发，实现跨域请求

线上使用express的http-proxy-middleware实现请求转发

### 功能实现
#### 上映电影部分
- [x] 获取正在上映的电影信息和即将上映电影的信息
- [x] 电影信息滚动(底部)加载提高响应速度
#### 排行部分
- [x] 获取所有可以从豆瓣api得到的排行榜
- [x] 查看排行榜详细，在排行榜中查看具体电影详细
#### 搜索部分
- [x] 支持用户根据关键字搜索
- [x] 支持用户根据给出标签进行标签搜索(与输入与标签相同的关键字进行搜索不同)
- [x] 根据搜索结果查看电影详情
- [x] 查看搜索历史
#### 电影详情部分
- [x] 获取电影所有的基础信息和评分信息
- [x] 获取电影的短评和长评，可查看该电影所有短评长评
- [x] 将电影标记为想看/看过
#### 影人信息部分
- [x] 获取影人基本信息
- [x] 查看影人作品详细
#### 用户中心部分
- [x] 查看收藏的影人
- [x] 查看想看的电影
- [x] 查看看过的电影

### 关于浏览器跨域
#### 开发环境
项目通过vue脚手架vue-cli进行配置，可在'config/index'目录下进行如下配置
```
proxyTable: {
      '/v2': {
        target: 'http://api.douban.com',
        changeOrigin: true,
        pathRewrite: {
          '^/v2': '/v2'
        }
      }
    }
```
参数里中的changeOrigin，接收一个布尔值，如果设置为true,那么本地会虚拟一个服务端接收你的请求并代你发送该请求，这样就不会有跨域问题了
vue-cli的这个设置来自于其使用的插件http-proxy-middleware
#### 生产环境
服务器端配置
```
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();
app.use('/static', express.static(`${__dirname}/static`));
app.use('/v2', proxy({
  target: 'http://api.douban.com',
  changeOrigin: true,
}));

app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});
app.listen(8000);
```
本质上都是通过使用'http-proxy-middleware'中间件实现代理
### 关于移动端滚动库better-scroll
better-scroll 是一个移动端滚动的解决方案，它是基于 iscroll 的重写，它和 iscroll 的主要区别在这里。better-scroll 也很强大，不仅可以做普通的滚动列表，还可以做轮播图、picker 等等。

从之前[黄轶](https://github.com/ustbhuangyi)老师的[高仿elem外卖app](https://github.com/ustbhuangyi/vue-sell)开始接触过这个滚动库，感觉体验感很好，用起来也比较顺手，所以在后来的项目联系中就一直在使用。
推荐大家也尝试一下:)

滚动的原理时父容器有固定的高度。父容器的第一个子元素，它的高度会随着内容的大小而撑高。当内容的高度不超过父容器的高度，是不能滚动的，而它一旦超过了父容器的高度，我们就可以滚动内容区了，这就是better-scroll 的滚动原理。

可以通过黄轶老师的这篇文章具体了解下:[当 better-scroll 遇见 Vue](https://juejin.im/post/59300b2e2f301e006bcdd91c)

better-scroll的github地址戳:[better-scroll](https://github.com/ustbhuangyi/better-scroll/)

## 项目布局
```
├─build                       // webpack配置文件
├─config                      // 项目开发环境配置相关代码   
├─dist                        // 项目打包目录
├─screenshots                 // 项目截图
├─src                         // 源码目录    
│  ├─api                      // axios请求，获取项目数据
│  ├─base                     // 项目基础组件
│  │  ├─confirm               // 确认框组件
│  │  ├─history-list          // 历史记录列表组件
│  │  ├─loading               // 初始加载过渡组件
│  │  ├─loadmore              // 加载更多组件
│  │  ├─scroll                // 页面滚动组件
│  │  ├─search-box            // 搜索框组件
│  │  ├─star                  // 星级评分组件
│  │  └─switches              // 选项卡组件
│  ├─common                   // 公共资源 
│  │  ├─fonts                 // 图标字体
│  │  ├─image                 // 图片资源
│  │  ├─js                    // 公共方法
│  │  └─stylus                // css样式
│  ├─components               // 业务组件 
│  │  ├─all-discussion        // 全部评论组件
│  │  ├─celebrity-detail      // 影人详情组件
│  │  ├─celebrity-info        // 影人基础信息组件
│  │  ├─celebrity-list        // 影人列表组件
│  │  ├─celebrity-works       // 影人作品组件
│  │  ├─movie-comment         // 电影短评组件
│  │  ├─movie-detail          // 电影详情组件
│  │  ├─movie-info            // 电影基础信息组件
│  │  ├─movie-list            // 电影列表组件
│  │  ├─movie-review          // 电影长评组件
│  │  ├─movie-show            // 主页上映电影组件
│  │  ├─rank                  // 排行组件
│  │  ├─rank-detail           // 排行详情组件
│  │  ├─rank-list             // 排行列表组件
│  │  ├─review-detail         // 电影长评详情组件
│  │  ├─search                // 电影搜索组件
│  │  ├─suggest               // 搜索结果组件
│  │  ├─tab                   // 主页tab栏组件
│  │  └─user-center           // 用户中心组件
│  ├─router                   // vue-router路由管理
│  └─store                    // vuex状态管理 
└─static 
```
