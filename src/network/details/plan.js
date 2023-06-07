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
