import Vue from 'vue'
import Loading from './Loading.vue'
import Vuetify from 'vuetify/lib';

const LoadingConstructor = Vue.extend(Loading)

const loading = function () {
    let instance = new LoadingConstructor()
    //这个得有，不然vuetify会主题出问题
    instance.$vuetify = new Vuetify().framework
    instance.$mount()
    document.body.appendChild(instance.$el)
    let t;
    //显示遮罩
    instance.show = (options) => {
        instance.autoClose = true
        Object.assign(instance, options)
        instance.visibility = true
        //两秒后显示取消加载的按钮
        t = setTimeout(() => {
            instance.cancelShow = true
        }, 2000)
        return instance
    }
    //关闭加载遮罩时的回调函数
    let closeAction = () => {
    }
    //设置关闭加载遮罩时的回调函数
    instance.setCloseAction = (func) => {
        if (typeof func === "function") {
            closeAction = func
        }
    }
    //关闭加载遮罩
    instance.close = () => {
        clearTimeout(t)
        instance.cancelShow = false
        closeAction(instance)
        if (instance.autoClose) {
            instance.visibility = false
        }
    }
    return instance
}

export default loading()
