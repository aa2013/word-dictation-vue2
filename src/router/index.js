import Vue from 'vue'
import VueRouter from 'vue-router'
import CommonLib from '../views/CommonLib.vue'
import MyLib from '../views/MyLib.vue'
import Plan from '../views/Plan.vue'
import Root from '../views/Root.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Print from "@/views/Print";

Vue.use(VueRouter)

const routes = [
    {
        path: '/root',
        component: Root,
        redirect: '/common-lib',
        meta: {
            title: '单词本'
        },
        children: [
            {
                path: '/common-lib',
                component: CommonLib,
                meta: {
                    icon: 'mdi-book-open-outline',
                    title: '公开词库'
                },
            },
            {
                path: '/my-lib',
                component: MyLib,
                meta: {
                    icon: 'mdi-book-outline',
                    title: '我的词库'
                },
            },
            {
                path: '/plan',
                component: Plan,
                meta: {
                    icon: 'mdi-lightbulb-on-outline',
                    title: '生成方案'
                },
            },
        ]
    },
    {
        path: '/',
        name: '',
        redirect: '/common-lib'
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/print',
        name: 'print',
        component: Print
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        router.push({path: "/404"})
        return
    }
    window.document.title = to.meta.title;
    next();
})
export default router
