import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/element.js'
import SnackBar from "@/components/snackBar";
import MyDialog from '@/components/dialog'
import Loading from '@/components/loading'
// 引入全局css样式
import './assets/css/global.css'
import './assets/css/scrollBar.css'
import './assets/css/element-table-scroll-bar.css'
// 教材http://www.goodkejian.com/list/3_1.htm
Vue.prototype.snackBar = SnackBar
Vue.prototype.dialog = MyDialog
Vue.prototype.loading = Loading
Vue.prototype.isDev = process.env.NODE_ENV === 'development'
Vue.prototype.isPro = process.env.NODE_ENV === 'production'
Vue.config.productionTip = false
new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
