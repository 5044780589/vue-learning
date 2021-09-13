import Vue from 'vue'
import App from './App.vue'
import router from './krouter'
import store from './kstore'
// import store from './store'
// import router from './router'

Vue.config.productionTip = false
// 事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  router,//为了在调用Vue.use(VueRouter)时能延迟到某一时间点获取到router配置项，通过混入模式mixin实现
  store,
  render: h => h(App)
}).$mount('#app')