<template>
    <div class="login-bg">
        <div class="login-container">
            <v-card elevation="2" class="login-card" :disabled="loggingIn">
                <img src="../assets/img/logo.png" alt="" class="login-logo">
                <p class="login-card-title">用户登录</p>
                <v-text-field v-model="account" label="账号" dense
                              prepend-inner-icon="mdi-account" outlined/>
                <v-text-field @keydown.native.enter="login" v-model="password" type="password"
                              label="密码" dense
                              prepend-inner-icon="mdi-lock"
                              outlined/>


                <div class="d-flex justify-space-between">
                    <v-checkbox style="margin: 0;padding: 0" hide-details dense v-model="remember" label="记住我"/>
                    <span class="forget-pwd">忘记密码？</span>
                </div>
                <v-btn block elevation="2" large rounded :loading="loggingIn"
                       class="login-btn" @click="login">
                    登录
                </v-btn>
                <div class="d-flex justify-center">
                    <v-btn text class="forget-pwd" @click="gotoRegister">
                        没有账号？去注册
                    </v-btn>
                </div>

            </v-card>
            <p class="copy-right">
                Copyright © UniversalLogin, All Rights Reserved.
                Email : 1111@qq.com WeChat: vx2321345
            </p>
        </div>
    </div>
</template>

<script>
    import * as user from '@/network/details/user'
    import {JSEncrypt} from 'jsencrypt'

    export default {
        name: "Login",
        data: () => ({
            remember: false,
            account: '',
            password: '',
            loggingIn: false,
            verifyCode: '',
            lessTime: 0,
            loginType: 'pwd',
            time: null,
        }),
        created() {
            if (this.isLogOut()) {
                this.$router.replace("/login")
            } else if (localStorage.getItem('token')) {
                this.$router.push({
                    path: "/"
                })
            }
        },
        methods: {
            /**
             * 判断是否是登出行为
             * */
            isLogOut() {
                let href = window.location.href
                let i = href.indexOf("logout")
                return i !== -1 && i + 6 === href.length
            },
            /**
             * 前往注册页
             * */
            gotoRegister() {
                this.$router.push("/register")
            },
            /**
             * 成功登录后干的事情
             * */
            loginSuccess(res) {
                //todo 登录成功
                this.loggingIn = false
                this.$router.push("/")
            },
            /**
             * 登录
             * */
            login() {
                if (this.loggingIn)
                    return
                this.loggingIn = true
                user.getPublicKey().then(res => {
                    let key = res.data
                    key = key.substring(0, 17) + key.substring(22)
                    let jsEncrypt = new JSEncrypt();
                    jsEncrypt.setPublicKey(key)
                    let account = jsEncrypt.encrypt(this.account)
                    let pwd = jsEncrypt.encrypt(this.password)
                    user.login({
                        account: account,
                        password: pwd
                    }).then(res => {
                        this.loginSuccess(res)
                    })
                })
            },
        }
    }
</script>

<style scoped lang="less">

    .login-bg {
        background: url("../assets/img/bg.png");
        position: fixed;
        width: 100%;
        height: 100%;
        min-width: 1920px;
        min-height: 1080px;
        background-size: 100% 100%;

        .login-container {
            user-select: none;
            position: absolute;
            left: calc(150px + 50%);
            top: 40%;
            transform: translate(-50%, -50%);
            width: 320px;
            min-height: 400px;

            .login-card {
                width: 100%;
                /*上 左右 下*/
                padding: 10px 20px 5px;

                .login-logo {
                    display: block;
                    margin: 0 auto 24px;
                }

                .login-card-title {
                    margin-bottom: 24px;
                    text-align: center;
                    font-weight: bold;
                    font-size: 24px;
                    color: #1485FE;
                }

                .login-btn {
                    margin: 10px 0;
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                    background-image: linear-gradient(to right, #3E50F7, #1485FE);
                }

                .forget-pwd {
                    display: inline-block;
                    line-height: 28px;
                    text-align: center;
                    font-size: 14px;
                    color: #1485FE;
                    cursor: pointer;
                    /*margin-top: 15px;*/
                }
            }

            .copy-right {
                margin-top: 30px;
                font-size: 14px;
                text-align: center;
                color: #999;
            }
        }
    }
</style>
