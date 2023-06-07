import Vue from 'vue'
import TableLoading from './TableLoading.vue'
import Vuetify from 'vuetify/lib';

const TableLoadingConstructor = Vue.extend(TableLoading)

const tableLoading = function () {
    let instance = new TableLoadingConstructor()
    //深拷贝保存默认数据
    let props = instance['_props']
    const defaultData = props === undefined ? {} : JSON.parse(JSON.stringify(props))
    //这个得有，不然vuetify会主题出问题
    instance.$vuetify = new Vuetify().framework
    //显示
    instance.show = (options) => {
        //使用默认数据覆盖
        Object.assign(instance, defaultData)
        Object.assign(instance, options)
        instance.visibility = true
        return instance
    }
    //关闭
    instance.close = () => {
        instance.visibility = false
        return instance
    }
    instance.init = (container) => {
        instance.$mount(container)
        container.appendChild(instance.$el)
        return instance
    }
    return instance
}

export default tableLoading()
