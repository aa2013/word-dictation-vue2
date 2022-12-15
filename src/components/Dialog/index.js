import Vue from 'vue'
import MyDialog from './Dialog.vue'
import Vuetify from 'vuetify/lib';

const DialogConstructor = Vue.extend(MyDialog)

const dialog = function () {
    const instance = new DialogConstructor()
    //这个得有，不然vuetify会主题出问题
    instance.$vuetify = new Vuetify().framework
    instance.$mount('#app')
    document.body.appendChild(instance.$el)
    let getThis = () => Vue.prototype.dialog
    const setPrevent = (prevent) => {
        instance.prevent = prevent
        return getThis()
    }
    const show = (options) => {
        Object.assign(instance, options)
        instance.show = true
        return getThis()
    }
    const rightClick = (func) => {
        instance.$on("right", () => {
            func(instance)
        })
        return getThis()
    }
    const leftClick = (func) => {
        instance.$on("left", () => {
            func(instance)
        })
        return getThis()
    }
    const neutralClick = (func) => {
        instance.$on("neutral", () => {
            func(instance)
        })
        return getThis()
    }
    return {
        show: show,
        setPrevent: setPrevent,
        onLeftClick: leftClick,
        onRightClick: rightClick,
        onNeutralClick: neutralClick,
    }
}

export default dialog()
