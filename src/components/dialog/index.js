import Vue from 'vue'
import MyDialog from './Dialog.vue'
import Vuetify from 'vuetify/lib';

const DialogConstructor = Vue.extend(MyDialog)

const dialog = function () {
    const instance = new DialogConstructor()
    //深拷贝保存默认数据
    let props = instance['_props']
    const defaultData = props === undefined ? {} : JSON.parse(JSON.stringify(props))
    //这个得有，不然vuetify会主题出问题
    instance.$vuetify = new Vuetify().framework
    instance.$mount()
    document.body.appendChild(instance.$el)
    let getThis = () => Vue.prototype.dialog
    const setPrevent = (prevent) => {
        instance.prevent = prevent
        return getThis()
    }
    let leftClickActon = () => {
    }
    let rightClickActon = () => {
    }
    let neutralClickActon = () => {
    }
    const show = (options) => {
        instance.autoClose = true
        //使用默认数据覆盖
        Object.assign(instance, defaultData)
        Object.assign(instance, options)
        instance.show = true
        //重置点击事件
        resetActions()
        return getThis()
    }

    function resetActions() {
        //重置点击事件
        leftClickActon = () => {
        }
        rightClickActon = () => {
        }
        neutralClickActon = () => {
        }
    }

    function onLeftClick(action) {
        if (typeof action === "function") {
            instance.leftShow = true
            leftClickActon = action
        }
        return getThis()
    }

    function onRightClick(action) {
        if (typeof action === "function") {
            instance.rightShow = true
            rightClickActon = action
        }
        return getThis()
    }

    function onNeutralClick(action) {
        if (typeof action === "function") {
            instance.neutralShow = true
            neutralClickActon = action
        }
        return getThis()
    }

    instance.leftClick = () => {
        leftClickActon(instance)
        if (instance.autoClose) {
            instance.show = false
        }
    }
    instance.rightClick = () => {
        rightClickActon(instance)
        if (instance.autoClose) {
            instance.show = false
        }
    }
    instance.neutralClick = () => {
        neutralClickActon(instance)
        if (instance.autoClose) {
            instance.show = false
        }
    }
    return {show, setPrevent, onLeftClick, onRightClick, onNeutralClick,}
}

export default dialog()
