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
    instance.show = (options) => {
        Object.assign(instance, options)
        instance.visibility = true
        //两秒后显示取消加载的按钮
        t = setTimeout(() => {
            instance.cancelShow = true
        }, 2000)
    }
    instance.close = () => {
        instance.visibility = false
        instance.cancelShow = false
        clearTimeout(t)
    }
    return instance
}

export default loading()
