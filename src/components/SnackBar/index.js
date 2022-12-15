import Vue from 'vue'
import SnackBar from './SnackBar.vue'
import Vuetify from 'vuetify/lib';

const SnackBarConstructor = Vue.extend(SnackBar)

const bar = function () {
    const instance = new SnackBarConstructor()
    //这个得有，不然vuetify会主题出问题
    instance.$vuetify = new Vuetify().framework
    instance.$mount('#app')
    document.body.appendChild(instance.$el)

    instance.show = (options) => {
        instance.time = options.time ?? 3000
        instance.color = options.color ?? "blue"
        instance.text = options.text ?? options
        instance.visibility = true
    }
    return instance
}

export default bar()
