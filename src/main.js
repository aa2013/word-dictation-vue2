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

Vue.prototype.showSnackBar = SnackBar.show
Vue.prototype.dialog = MyDialog
Vue.prototype.loading = Loading
Vue.config.productionTip = false
new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
