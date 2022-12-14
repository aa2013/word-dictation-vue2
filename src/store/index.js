import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        msgDialog: {},
        snackBar: {}
    },
    mutations: {
        setMsgDialog(state, value) {
            state.msgDialog = value
        },
        setSnackBar(state, value) {
            state.msgDialog = value
        }
    },
    getters: {
        getMsgDialog: state => state.msgDialog,
        getSnackBar: state => state.snackBar,
    },
    actions: {},
    modules: {}
})
