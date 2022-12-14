import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import SnackBar from "@/components/SnackBar";

import MyDialog from '@/components/Dialog'

Vue.prototype.showSnackBar = SnackBar.show
Vue.prototype.dialog = MyDialog
Vue.config.productionTip = false
new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
