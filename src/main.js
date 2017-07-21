import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import VueLazyLoad from 'vue-lazyload'; // 图片懒加载
// import fastclick from 'fastclick'; // 消除在移动浏览器上触发click事件300ms延迟。

import 'common/stylus/index.styl'; // 引入样式表
// fastclick.attach(document.body);

Vue.use(VueLazyLoad, {
  loading: require('./common/image/loading.gif')
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
