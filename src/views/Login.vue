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
          <span v-ripple class="forget-pwd radius-4" @click="showForgetPwdDialog">&nbsp;&nbsp;忘记密码？</span>
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
    <v-dialog v-model="forgetPwdDialog.show" :disabled="forgetPwdDialog.submitLoading" max-width="350">
      <v-card>
        <v-card-title>
          密码找回
        </v-card-title>
        <v-card-text>
          <v-form ref="forgetPwdForm">
            <v-text-field outlined dense v-model="forgetPwdDialog.account" label="注册邮箱"
                          ref="account" :rules="[v=>(v&&v.length>0)||'请输入注册邮箱']"/>
            <div class="d-flex">
              <v-text-field outlined dense v-model="forgetPwdDialog.code"
                            label="验证码" :rules="[v=>(v&&v.length>0)||'请输入验证码']"/>
              <v-btn text color="green" class="m5l m5t" @click="sendVerifyCode"
                     :disabled="forgetPwdDialog.sendText!=='发送'" :loading="forgetPwdDialog.sendLoading">
                {{ forgetPwdDialog.sendText }}
              </v-btn>
            </div>
            <v-text-field outlined dense v-model="forgetPwdDialog.newPwd" label="新密码" ref="newPwd" type="password"
                          :rules="[v=>(v&&/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+$/.test(v))||'必须包含大小写字母和数字',v=>(v&&v.length>=8 && v.length<=16)||'长度必须大于等于8且小于等于16']"/>
            <v-text-field outlined dense v-model="forgetPwdDialog.newPwdAgain" ref="newPwdAgain" type="password"
                          label="再次输入新密码" :rules="[v=>(v&&v===forgetPwdDialog.newPwd)||'两次密码必须相等']"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text color="green" @click="forgetPwdDialog.show=false">取消</v-btn>
          <v-btn text color="green" @click="submitForgetData" :loading="forgetPwdDialog.submitLoading">
            提交
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    forgetPwdDialog: {
      show: false,
      code: '',
      submitLoading: false,
      sendText: '发送',
      sendLoading: false,
      account: '',
      newPwd: '',
      newPwdAgain: '',
      interval: null
    }
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
    showForgetPwdDialog() {
      clearInterval(this.forgetPwdDialog.interval)
      this.forgetPwdDialog = {
        show: true,
        code: '',
        submitLoading: false,
        sendText: '发送',
        sendLoading: false,
        newPwd: '',
        newPwdAgain: '',
        interval: null
      }
      this.$nextTick(() => {
        this.$refs.forgetPwdForm.reset()
      })
    },
    submitForgetData() {
      if (!this.$refs.forgetPwdForm.validate()) {
        return
      }
      this.forgetPwdDialog.submitLoading = true
      user.resetPwd({
        email: this.forgetPwdDialog.account,
        code: this.forgetPwdDialog.code,
        now: this.forgetPwdDialog.newPwd,
        again: this.forgetPwdDialog.newPwdAgain,
      }).then(res => {
        if (res.data === true) {
          this.snackBar.show("修改成功，请重新登录");
          this.forgetPwdDialog.show = false
        } else {
          this.snackBar.show({
            color: 'red',
            text: "修改失败"
          })
        }
      }).catch(err => {
        this.snackBar.show({
          color: 'red',
          text: "验证码发送失败"
        })
      }).finally(() => {
        this.forgetPwdDialog.submitLoading = false
      })
    },
    sendVerifyCode() {
      if (!this.$refs.account.validate()) {
        return
      }
      this.forgetPwdDialog.sendLoading = true
      user.sendForgetPwdCode({
        email: this.forgetPwdDialog.account
      }).then(res => {
        if (res.data === true) {
          this.forgetPwdDialog.isSend = true
          let time = 60
          this.forgetPwdDialog.sendText = time + ' s'
          this.forgetPwdDialog.sendInterval = setInterval(() => {
            this.forgetPwdDialog.sendText = (--time) + ' s'
            if (time <= 0) {
              this.forgetPwdDialog.sendText = '发送'
              clearInterval(this.forgetPwdDialog.sendInterval)
            }
          }, 1000)
        } else {
          this.snackBar.show({
            color: 'red',
            text: "验证码发送失败"
          })
        }
      }).catch(err => {
        this.snackBar.show({
          color: 'red',
          text: "验证码发送失败"
        })
      }).finally(() => {
        this.forgetPwdDialog.sendLoading = false
      })
    },
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
      // 获取RSA加密public key
      user.getPublicKey().then(res => {
        let key = res.data
        key = key.substring(0, 17) + key.substring(22)
        let jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(key)
        // 加密账号和密码
        let account = jsEncrypt.encrypt(this.account)
        let pwd = jsEncrypt.encrypt(this.password)
        // 登录
        user.login({
          account: account,
          password: pwd,
          remember: this.remember
        }).then(res => {
          this.loginSuccess(res)
        }).finally(() => {
          this.loggingIn = false
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
