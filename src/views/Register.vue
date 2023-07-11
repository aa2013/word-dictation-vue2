<template>
  <v-app>
    <div class="login-bg">
      <div class="login-container">
        <v-card elevation="2" class="login-card">
          <img src="../assets/img/logo.png" alt="" class="login-logo">
          <p class="login-card-title">用户注册</p>
          <v-text-field v-model="account" label="邮箱" dense
                        prepend-inner-icon="mdi-account" outlined/>
          <v-text-field v-model="password" type="password"
                        label="密码" dense
                        prepend-inner-icon="mdi-lock"
                        outlined/>
          <v-text-field v-model="pwdAgain" type="password"
                        label="再次输入密码" dense
                        prepend-inner-icon="mdi-lock"
                        outlined/>
          <div class="d-flex flex-row">
            <v-text-field @keydown.native.enter="register"
                          label="验证码" dense v-model="verifyCode"
                          prepend-inner-icon="mdi-security" outlined/>
            <v-btn text color="primary" :loading="codeLoading" @click="sendCode"
                   style="margin-left: 5px;margin-top: 2px">
              {{ lessTime === 0 ? "发送" : lessTime }}
            </v-btn>
          </div>

          <v-btn block elevation="2" large rounded :loading="registerIn"
                 class="login-btn" @click="register">
            注册
          </v-btn>
          <div class="text-center">
            <v-btn text class="forget-pwd" @click="gotoLogin">
              已有账号？去登录
            </v-btn>
          </div>

        </v-card>
        <p class="copy-right">
          Copyright © UniversalLogin, All Rights Reserved.
          Email : 1111@qq.com WeChat: vx2321345
        </p>
      </div>
    </div>
  </v-app>
</template>

<script>
import * as user from "../network/details/user";
import * as util from "@/assets/js/util";

export default {
  name: "Login",
  data: () => ({
    remember: false,
    account: '',
    password: '',
    pwdAgain: '',
    registerIn: false,
    pwdEditShow: true,
    verifyCode: '',
    lessTime: 0,
    time: null,
    codeLoading: false,
  }),
  created() {
  },
  methods: {
    show60sTime() {
      if (this.lessTime === 0) {
        clearInterval(this.time)
      } else {
        this.lessTime--;
      }
    },
    sendCode() {
      if (this.lessTime !== 0) {
        return
      }
      if (util.isEmail(this.account)) {
        this.codeLoading = true
        user.sendRegisterCode({
          email: this.account
        }).then(res => {
          if (res.data === true) {
            this.snackBar.show("验证码发送成功！")
            this.lessTime = 60
            this.time = setInterval(this.show60sTime, 1000)
          } else {
            this.snackBar.error("验证码发送失败！")
          }
        }).finally(() => {
          this.codeLoading = false
        })
      } else {
        clearInterval(this.time)
        this.lessTime = 0
        this.dialog.show({
          title: "错误",
          type: "danger",
          content: "邮箱格式错误",
        })
      }
    },
    gotoLogin() {
      this.$router.push("/login")
    },
    register() {
      if (this.registerIn)
        return
      if (this.password !== this.pwdAgain) {
        this.dialog.show({
          title: "错误",
          type: "danger",
          content: "两次密码不一致",
        })
      } else if (!this.verifyCode) {
        this.dialog.show({
          title: "错误",
          type: "danger",
          content: "请输入验证码",
        })
      } else {
        //注册
        if (util.isEmail(this.account)) {
          this.registerIn = true
          user.register({
            email: this.account,
            pwd: this.password,
            pwdAgain: this.pwdAgain,
            emailCode: this.verifyCode,
          }).then(res => {
            if (res.data === true) {
              this.dialog.show({
                title: "注册成功",
                type: "info",
                content: "注册成功！点击跳转登录页面",
              }).onRightClick(() => {
                this.$router.push("/login")
              })
              this.registerIn = false
            } else {
              this.dialog.show({
                title: "注册失败",
                type: "danger",
                content: "注册失败！请检查信息是否合法",
              })
            }
          }).finally(() => {
            this.registerIn = false
          })
        } else {
          this.dialog.show({
            title: "错误",
            type: "danger",
            content: "邮箱格式错误",
          })
        }
      }
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
    width: 370px;
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
