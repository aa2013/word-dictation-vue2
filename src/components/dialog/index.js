import Vue from 'vue'
import MyDialog from './Dialog.vue'
import Vuetify from 'vuetify/lib';

const DialogConstructor = Vue.extend(MyDialog)

const dialog = function () {
    const instance = new DialogConstructor()
    //这个得有，不然vuetify会主题出问题
    instance.$vuetify = new Vuetify().framework
    instance.$mount()
    document.body.appendChild(instance.$el)
    let getThis = () => Vue.prototype.dialog
    const setPrevent = (prevent) => {
        instance.prevent = prevent
        return getThis()
    }
    const show = (options) => {
        instance.autoClose = true
        Object.assign(instance, options)
        instance.show = true
        return getThis()
    }
    let leftClickActon = () => {
    }
    let rightClickActon = () => {
    }
    let neutralClickActon = () => {
    }

    function onLeftClick(action) {
        if (typeof action === "function") {
            leftClickActon = action
        }
    }

    function onRightClick(action) {
        if (typeof action === "function") {
            rightClickActon = action
        }
    }

    function onNeutralClick(action) {
        if (typeof action === "function") {
            neutralClickActon = action
        }
    }

    instance.leftClick = () => {
        leftClickActon()
        if (instance.autoClose) {
            instance.show = false
        }
        return getThis()
    }
    instance.rightClick = () => {
        rightClickActon()
        if (instance.autoClose) {
            instance.show = false
        }
        return getThis()
    }
    instance.neutralClick = () => {
        neutralClickActon()
        if (instance.autoClose) {
            instance.show = false
        }
        return getThis()
    }
    return {
        show: show,
        setPrevent: setPrevent,
        onLeftClick: onLeftClick,
        onRightClick: onRightClick,
        onNeutralClick: onNeutralClick,
    }
}

export default dialog()
