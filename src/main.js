
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import router from './routes'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);




/*路由钩子函数*/
router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {

  }
  next()
});

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({

  router,
  store,
  render: h => h(App)
}).$mount('#app');

