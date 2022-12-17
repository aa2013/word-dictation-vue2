import {request} from "../request";

export function getWordList(data) {
    return request({
        url: '/word/list',
        method: 'get',
        params: data,
        animation: false
    })
}
