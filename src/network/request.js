import axios from "axios";

let util = require("../assets/js/util.js")

//提示： 可参考视频资料：https://www.bilibili.com/video/BV15741177Eh?p=155

export function request(config) {
    config.anim = config.anim ?? true
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

    }

    //结束加载动画
    function endLoading() {
    }

    //axios 拦截器
    //请求拦截
    instance.interceptors.request.use(request => {
        // request.data = qs.stringify(request.data)
        //请求时的加载动画
        if (config.anim) {
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
        if ('authorization' in res.headers) {
            localStorage.setItem('token', res.headers.authorization);
        }
        if (res.data.status !== 200) {
            let desc = res.data.desc;
            console.log(res.data.desc)
            desc = desc ?? "服务器内部错误"
            util.errorMsg((res.data.status ?? res.data.code) + " : " + desc).then(r => {
            })
            // throw new Error(desc)
        }
        if (!window.location.href.includes("Login.vue")) {
            setTimeout(res => {
                endLoading();//结束加载动画
            }, 251)
        }

        sessionStorage.setItem("serverError", "false")
        return res.data
    }, err => {
        let status = -1;
        if (err.response === undefined) {
            MessageBox.alert('请求超时', '错误', {
                confirmButtonText: "重新加载",
                type: 'error'
            }).then(r => {
                window.location.reload()
            });
        } else {
            status = err.response.status
        }
        //结束动画
        if (!window.location.href.includes("Login.vue")) {
            endLoading()
        }
        // 如果多次弹窗就直接结束，只弹一次
        if (sessionStorage.getItem("serverError") === "true") {
            return
        }
        sessionStorage.setItem("serverError", "true")
        if (status === 401) {
            let msg = href.includes("/login") ? "登录失败，账号或密码错误" : "未登录"
            MessageBox.alert(msg, '提示', {
                type: 'warning'
            }).then(r => {
                localStorage.removeItem('token')
                window.location.href = href.substring(0, href.indexOf("/")) + "/login"
            });
        } else if (status === 403) {
            MessageBox.alert('权限不足', '提示', {
                type: 'warning'
            }).then(r => {
            });
        } else if (status >= 500 && status < 600) {
            MessageBox.alert('服务器内部错误', '错误', {
                type: 'error'
            }).then(r => {
                window.location.reload()
            });
        } else if (status !== -1) {
            MessageBox.alert('未知错误', '错误', {
                confirmButtonText: "重新加载",
                cancelButtonText: '取消',
                type: 'error'
            }).then(r => {
                window.location.reload()
            });
        }
    })
    // 发送真正的网络请求
    return instance(config)
}
