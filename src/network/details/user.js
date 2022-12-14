import {request} from "../request";
export function abc(data){
    return request({
        url: '/dep/list',
        method: 'get',
        params: data,
        anim:false
    })
}
