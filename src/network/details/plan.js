import {request} from "../request";

export function add(data) {
    return request({
        url: '/plan/add',
        method: 'post',
        data: data,
    })
}

export function getList(data) {
    return request({
        url: '/plan/list',
        method: 'get',
        params: data,
    })
}
export function getWords(planId) {
    return request({
        url: `/plan/words/${planId}`,
        method: 'get',
    })
}
export function remove(planId) {
    return request({
        url: `/plan/remove/${planId}`,
        method: 'post',
    })
}
