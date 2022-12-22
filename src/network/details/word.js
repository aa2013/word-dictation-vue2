import {request} from "../request";

export function getWordList(data) {
    return request({
        url: '/word/list',
        method: 'get',
        params: data,
        animation: false
    })
}
export function getOtherExplains(data) {
    return request({
        url: '/word/otherExplains',
        method: 'get',
        params: data,
        animation: false
    })
}
