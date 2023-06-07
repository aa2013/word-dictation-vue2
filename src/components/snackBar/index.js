import Vue from 'vue'
import SnackBar from './SnackBar.vue'
import Vuetify from 'vuetify/lib';

const SnackBarConstructor = Vue.extend(SnackBar)

const bar = function () {
    const instance = new SnackBarConstructor()
    //深拷贝保存默认数据
    let props = instance['_props']
    const defaultData = props === undefined ? {} : JSON.parse(JSON.stringify(props))
    //这个得有，不然vuetify会主题出问题
    instance.$vuetify = new Vuetify().framework
    instance.$mount()
    document.body.appendChild(instance.$el)

    let getThis = () => Vue.prototype.snackBar
    instance.show = (options) => {
        instance.autoClose = true
        //使用默认数据覆盖
        Object.assign(instance, defaultData)
        Object.assign(instance, options)
        if (typeof options !== "object") {
            instance.text = options
        }
        instance.visibility = true
        return getThis()
    }
    let click = () => {
    }
    let setClick = (action) => {
        if (typeof action === "function") {
            instance.btnShow = true
            click = action
        }
    }
    instance.onClick = () => {
        click(instance)
        if (instance.autoClose) {
            instance.visibility = false
        }
        return getThis()
    }
    return {
        show: instance.show,
        onClick: setClick
    }
}

export default bar()
