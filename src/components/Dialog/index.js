import Vue from 'vue'
import MyDialog from './Dialog.vue'
import Vuetify from 'vuetify/lib';

const DialogConstructor = Vue.extend(MyDialog)

const dialog = function (options) {
    const instance = new DialogConstructor()
    //这个得有，不然vuetify会主题出问题
    instance.$vuetify = new Vuetify().framework
    instance.$mount()
    document.body.appendChild(instance.$el)
    Object.assign(instance, options)
    instance.show = true
    return new Promise(revolve => {
        instance.$on("left", () => {
            revolve(true)
        })
        instance.$on("right", () => {
            revolve(false)
        })
    })
}


export default dialog()
