import Vue from 'vue'
import SnackBar from './SnackBar.vue'
import Vuetify from 'vuetify/lib';

const SnackBarConstructor = Vue.extend(SnackBar)

const bar = function () {
    const instance = new SnackBarConstructor()
    //这个得有，不然vuetify会主题出问题
    instance.$vuetify = new Vuetify().framework
    instance.$mount()
    document.body.appendChild(instance.$el)

    instance.show = (options) => {
        instance.autoClose = true
        Object.assign(instance,options)
        if (typeof options==="string") {
            instance.text = options
        }
        instance.visibility = true
    }
    instance.onClick = (action) => {
        if (typeof action === "function") {
            action(instance)
        }
        if (instance.autoClose) {
            instance.visibility = false
        }
    }
    return instance
}

export default bar()
