import {request} from "../request";

export function getListSelf(data) {
    return request({
        url: '/lib/list/self',
        method: 'get',
        params: data,
    })
}

export function getListCommon(data) {
    return request({
        url: '/lib/list/common',
        method: 'get',
        params: data,
        animation: false
    })
}

export function add(data) {
    return request({
        url: `/lib/add/${data}`,
        method: 'post',
        animation: false
    })
}

export function remove(data) {
    return request({
        url: `/lib/remove/${data}`,
        method: 'post',
        animation: false
    })
}
