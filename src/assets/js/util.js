let store = require('../../store').default
const addSessionStorageSetEvent = () => {
    let originSetItem = window.sessionStorage.setItem;
    window.sessionStorage.setItem = function (key, newValue) {
        let setItemEvent = new Event("setItemEvent");
        setItemEvent.key = key;
        setItemEvent.newValue = newValue;
        window.dispatchEvent(setItemEvent);
        originSetItem.apply(this, arguments);
    }
}
const showSnackBar = (text, color, time) => {
    let SnackBar = {
        text: text,
        color: color,
        time: time,
        show: true
    }
    store.state.snackBar = SnackBar
}
const showMsgDialog = (data = {}) => {
    let MsgDialog = {
        show: true,
        persistent: false,
        maxWidth: 290,
        title: "",
        pre: false,
        message: "",
        disAgreeText: "取消",
        disAgreeShow: true,
        disAgreeAction: null,
        disAgreeBtnColor: "green darken-1",
        agreeText: "确定",
        agreeShow: true,
        agreeBtnColor: "primary",
        agreeAction: null
    }
    let assign = Object.assign(MsgDialog, data);
    console.log(assign)
    store.state.msgDialog = assign
}
const toFun = (funStr) => {
    let fun = Function('"use strict";return (' + funStr + ')')();
    if (fun && typeof fun === "function")
        return fun
    return () => {
    }
}
const getTimeInfo = date => {
    if (typeof date === "string")
        date = new Date(date)
    let pad = (v) => {
        return v.toString().padStart(2, "0")
    }
    return {
        year: pad(date.getFullYear()),
        month: pad(date.getMonth() + 1),
        day: pad(date.getDate()),
        hour: pad(date.getHours()),
        minute: pad(date.getMinutes()),
        seconds: pad(date.getSeconds())
    }
}
const formatMinTime = date => {
    date = getTimeInfo(date)
    const {year, month, day, hour, minute, seconds} = date
    return `${[year, month, day].join('-')} ${[hour, minute].map(formatNumber).join(':')}`
}
const formatSecondsTime = date => {
    date = getTimeInfo(date)
    const {year, month, day, hour, minute, seconds} = date
    return `${[year, month, day].join('-')} ${[hour, minute, seconds].map(formatNumber).join(':')}`
}
const formatDayTime = date => {
    date = getTimeInfo(date)
    const {year, month, day, hour, minute, seconds} = date
    return `${[year, month, day].join('-')}`
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}
const testEmpty = value => {
    if (value === undefined || !value)
        throw new Error("不能为空值")
    else return value
}
const timestampToTime = timestamp => {
    let pad = (v) => {
        return v.toString().padStart(2, "0")
    }
    let days = parseInt(timestamp / (1000 * 60 * 60 * 24));
    let hour = parseInt((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let min = parseInt((timestamp % (1000 * 60 * 60)) / (1000 * 60));
    let s = parseInt((timestamp % (1000 * 60)) / 1000);
    return {
        day: pad(days),
        hour: pad(hour),
        min: pad(min),
        seconds: pad(s)
    }
}
/**
 * 简单实现防抖方法
 * @param fn 要防抖的函数
 * @param delay 防抖的毫秒数
 * @returns {Function}
 */
const debounce = (fn, delay = 100) => {
    let timer = null
    return function () {
        let args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

function isEmail(email) {
    let pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return pattern.test(email)
}

function isPhone(phone) {
    let pattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    return pattern.test(phone)
}

function userIsRemember() {
    return sessionStorage.getItem("remember") === "true";
}

module.exports = {
    userIsRemember,
    toFun,
    showMsgDialog,
    isPhone,
    isEmail,
    formatMinTime,
    formatSecondsTime,
    formatDayTime,
    testEmpty,
    timestampToTime,
    addLocalStorageSetEvent: addSessionStorageSetEvent,
    showSnackBar,
    debounce
}
