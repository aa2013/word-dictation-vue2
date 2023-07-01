import {request} from "../request";

export function create(data) {
    return request({
        url: '/lib/create',
        method: 'post',
        data: data,
    })
}
export function update(data) {
    return request({
        url: '/lib/update',
        method: 'post',
        data: data,
    })
}


export function getListSelf() {
    return request({
        url: '/lib/list/self',
        method: 'get',
    })
}

export function getLibInfo(libId) {
    return request({
        url: `/lib/info/${libId}`,
        method: 'get',
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

export function remove(libId) {
    return request({
        url: `/lib/remove/${libId}`,
        method: 'post',
        animation: false
    })
}
