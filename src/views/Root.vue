<template>
    <div id="inspire" style=" width:100%;height:100%;">
        <v-navigation-drawer v-model="drawer" app>
            <div style="height: 64px" class="nav-title d-flex justify-center">
                <img src="../assets/img/logo.png" alt="" width="44" height="44">
                <span>单词本</span>
            </div>
            <v-divider/>
            <v-list shaped nav>
                <v-list-item-group mandatory color="primary" :value="firstSelected">
                    <template v-for="(item,i) in menu">
                        <v-list-item link v-if="!item.children" @click="gotoPage(item,item.path)">
                            <v-list-item-icon>
                                <v-icon>{{ item.meta.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>{{ item.meta.title }}</v-list-item-title>
                        </v-list-item>
                        <v-list-group v-else :prepend-icon="item.icon"
                                      :value="curFirst===i">
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <v-list-item-group :value="curFirst===i?secondSelected:undefined">
                                <v-list-item v-for="(child,j) in item.children"
                                             @click="gotoPage(child,child.path)">
                                    <v-list-item-icon/>
                                    <v-list-item-title>{{ child.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list-group>
                    </template>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app style="background: white">

            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

            <v-toolbar-title>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item style="font-size: 17px" v-for="(item,i) in breadcrumb"
                                        :key="i" :to="{path:item.path}">
                        {{ item.meta.title }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </v-toolbar-title>
            <v-spacer/>
            <v-menu offset-y close-on-content-click rounded="lg" open-on-hover>
                <template v-slot:activator="{ on, attrs }">
                    <v-avatar class="avatar" size="40" v-bind="attrs" v-on="on">
                        <img src='../assets/img/avatar.jpg' alt="avatar">
                    </v-avatar>
                </template>
                <v-card>
                    <v-list-item-content class="justify-center">
                        <div class="mx-auto text-center " style="min-width: 240px">
                            <div class="d-flex justify-start" style="padding: 0 10px">
                                <v-avatar size="56px">
                                    <img src='../assets/img/avatar.jpg' alt="avatar">
                                </v-avatar>
                                <div class="d-flex justify-start flex-column text-left"
                                     style="height: 56px;margin-left: 10px;font-size: 14px;">
                                    <span>你好，{{ user.name }}</span>
                                    <span style="margin: 5px 0">
                                        {{ user.role.includes("STU") ? "学号" : "工号" }}
                                        ：
                                        {{ user.number }}
                                    </span>
                                    <span>
                                    {{ user.college }}
                                    </span>
                                </div>
                            </div>


                            <v-divider style="margin: 10px 0"></v-divider>
                            <div class="d-flex flex-column" style="padding: 0 5px">
                                <v-btn color="primary" text>
                                    <v-icon left small>
                                        mdi-key-outline
                                    </v-icon>
                                    修改密码
                                </v-btn>
                                <v-btn block class="text-left" color="#ff4081" text @click="logout">
                                    <v-icon left small>
                                        mdi-logout
                                    </v-icon>
                                    退出登录
                                </v-btn>

                            </div>
                        </div>
                    </v-list-item-content>
                </v-card>
            </v-menu>
        </v-app-bar>

        <v-main style="width: 100%;height: 100%;background: #F6F7F9;">
            <keep-alive>
                <router-view style="width:100%;height:100%;padding: 10px;overflow:auto hidden;"/>
            </keep-alive>
        </v-main>
    </div>
</template>

<script>

    export default {
        name: "Root",
        data: () => ({
            //菜单相关
            firstSelected: 0,
            secondSelected: 0,
            curFirst: 0,
            //抽屉
            drawer: null,
            // 用户信息相关
            user: {
                avatar: '../assets/img/avatar.jpg',
                name: localStorage.getItem('userName'),
                college: '智能技术与工程学院',
                number: localStorage.getItem('account'),
                role: localStorage.getItem('auth') ?? ""
            },
            //菜单
            menu: [],
            // 面包屑
            breadcrumb: [],
        }),
        computed: {},
        watch: {
            //监听路由变化设置菜单选择
            $route(now, old) {
                this.$store.commit('setQuery', {
                    path: old.path,
                    query: old.query
                })
                this.setMenuSelected();
            },
        },
        created() {
            this.setMenuSelected()
        },
        methods: {
            logout() {
                localStorage.removeItem('token')
                this.$router.push('/login?logout');
            },
            /**
             * 点击菜单页面跳转
             * @param menu 点击的菜单
             * @param newPath 菜单中对应的路径
             * */
            gotoPage(menu, newPath) {
                let nowPath = this.$route.path
                if (nowPath === newPath)
                    return
                this.$router.push({
                    path: newPath,
                    query: this.$store.getters.query[newPath]
                })
            },
            /**
             * 设置所属菜单被选中并展开
             * */
            async setMenuSelected() {
                this.breadcrumb = this.$route.matched;
                let route = this.$route.path
                this.menu = this.$router.options.routes[0].children
                for (let i = 0; i < this.menu.length; i++) {
                    let menu = this.menu[i];
                    if (route.indexOf(menu.path) === 0) {
                        this.firstSelected = this.curFirst = i;
                        if (menu.children === undefined) {
                            return
                        }
                        for (let j = 0; menu.children && j < menu.children.length; j++) {
                            let children = menu.children[j]
                            if (route.indexOf(children.path) !== -1) {
                                this.secondSelected = j
                                return;
                            }
                        }
                    }
                }
            },
        },
    }
</script>

<style scoped lang="less">

    .avatar {
        user-select: none;
        margin-right: 10px;
        cursor: pointer;
    }

    .nav-title {
        user-select: none;

        img {
            position: relative;
            top: 50%;
            transform: translate(0, -50%);
        }

        span {
            display: inline-block;
            font-size: 23px;
            font-weight: bold;
            line-height: 64px;
            margin-left: 10px;
        }
    }
</style>
