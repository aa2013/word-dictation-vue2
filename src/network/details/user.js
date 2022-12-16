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
