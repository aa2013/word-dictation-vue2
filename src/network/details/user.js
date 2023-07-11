import {request} from "../request";

export function getPublicKey(data) {
    return request({
        url: '/user/key',
        method: 'get',
        params: data,
        animation: false
    })
}

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        params: data,
        animation: false
    })
}

export function register(data) {
    return request({
        url: '/user/register',
        method: 'post',
        params: data,
        animation: false
    })
}

export function sendRegisterCode(data) {
    return request({
        url: '/user/register/code',
        method: 'post',
        params: data,
        animation: false
    })
}

export function sendForgetPwdCode(data) {
    return request({
        url: '/user/forgetPwd/code',
        method: 'post',
        params: data,
        animation: false
    })
}

export function resetPwd(data) {
    return request({
        url: '/user/forgetPwd/submit',
        method: 'post',
        params: data,
        animation: false
    })
}
