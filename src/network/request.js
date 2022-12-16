import axios from "axios";
import Vue from 'vue'

//提示： 可参考视频资料：https://www.bilibili.com/video/BV15741177Eh?p=155
export function request(config) {
    let vue = Vue.prototype;
    config.animation = config.animation ?? true
    const instance = axios.create({
        //根路径
        //开发时的后端请求路径
        baseURL: 'http://localhost:8092/',
        //部署时候的路径
        // baseURL: 'http://centos:8092',
        timeout: 30 * 1000,
    })

    //开始加载动画

    let loading;

    function startLoading() {
        loading = vue.loading.show()
    }

    //结束加载动画
    function endLoading() {
        //结束加载动画
        setTimeout(() => {
            loading && loading.close()
        }, 251)
    }

    //axios 拦截器
    //请求拦截
    instance.interceptors.request.use(request => {
        //请求时的加载动画
        if (config.animation) {
            startLoading();
        }
        request.headers = {
            "Content-type": "application/json",
            "Authorization": localStorage.getItem('token')
        }
        return request
    }, err => {
        console.log(err)
    })
    let href = window.location.href
    instance.interceptors.response.use(res => {
        endLoading()
        if ('authorization' in res.headers) {
            localStorage.setItem('token', res.headers.authorization);
        }
        if (res.data.status !== 200) {
            let desc = res.data.desc;
            console.log(res.data.desc)
            desc = desc ?? "服务器内部错误"
            vue.dialog.show({
                title: "请求失败",
                content: (res.data.status ?? res.data.code) + " : " + desc,
                leftShow: false,
                type: "danger"
            })
        }
        sessionStorage.setItem("serverError", "false")
        return res.data
    }, err => {
        endLoading()
        let status = -1;
        if (err.response === undefined) {
            vue.dialog.show({
                title: "请求失败",
                content: '请求超时',
                leftShow: false,
                rightText: "重新加载",
                type: "danger"
            }).onRightClick(() => {
                setTimeout(() => {
                    window.location.reload()
                }, 300)
            })
        } else {
            status = err.response.status
        }
        // 如果多次弹窗就直接结束，只弹一次
        if (sessionStorage.getItem("serverError") === "true") {
            return
        }
        sessionStorage.setItem("serverError", "true")
        if (status === 401) {
            let msg = href.includes("/login") ? "登录失败，账号或密码错误" : "未登录"
            vue.dialog.show({
                title: "提示",
                content: msg,
                leftShow: false,
                type: "info"
            }).onRightClick(() => {
                localStorage.removeItem('token')
                window.location.href = href.substring(0, href.indexOf("/")) + "/login"
            })
        } else if (status === 403) {
            vue.dialog.show({
                title: "提示",
                content: '权限不足',
                leftShow: false,
                type: "warn"
            });
        } else if (status >= 500 && status < 600) {
            vue.dialog.show({
                title: "错误",
                content: '服务器内部错误',
                leftShow: false,
                type: "danger"
            })
        } else if (status !== -1) {
            vue.dialog.show({
                title: "错误",
                content: '未知错误',
                leftShow: false,
                type: "danger"
            })
        }
    })
    // 发送真正的网络请求
    return instance(config)
}
