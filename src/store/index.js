import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        query: []
    },
    mutations: {
        setQuery: (state, data) => {
            let path = data['path']
            state.query[path] = data['query']
        }
    },
    getters: {
        query: state => state.query
    },
    actions: {},
    modules: {}
})
