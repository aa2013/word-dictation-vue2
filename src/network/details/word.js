import {request} from "../request";

export function importSingle(data) {
    return request({
        url: '/word/import/single',
        method: 'post',
        params: data,
        animation: false,
        dialog: false
    })
}

export function getWordList(data) {
    return request({
        url: '/word/search',
        method: 'get',
        params: data,
        animation: false
    })
}
export function getRandomWordList(data) {
    return request({
        url: '/word/randomList',
        method: 'get',
        params: data,
    })
}

export function getExplains(data) {
    return request({
        url: '/word/explains',
        method: 'get',
        params: data,
    })
}

export function changeDefaultExplain(data) {
    return request({
        url: '/word/changeDefaultExplain',
        method: 'get',
        params: data,
    })
}
