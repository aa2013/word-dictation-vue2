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
