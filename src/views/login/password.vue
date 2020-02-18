<template>
  <div class="pass-container">
    <div class="title-container">
      <img src="../../assets/img/login/logoimg.png">
    </div>
    <div class="form-content">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="手机号:" prop="mobile">
          <el-input v-model="ruleForm.mobile" type="text" name="mobile" placeholder="输入手机号" autocomplete="off" /><br>
        </el-form-item>

        <el-form-item label="验证码:" prop="code" style="width:70%;">
          <el-input v-model="ruleForm.code" placeholder="输入验证码" name="code" autocomplete="off" />
          <el-button class="button-content" @click="getVerifyCode(ruleForm.mobile)">{{ yzmText }}</el-button>
        </el-form-item>

        <el-form-item label="新密码:" prop="pass">
          <el-input v-model="ruleForm.pass" name="pass" type="password" autocomplete="off" placeholder="输入新密码" />
        </el-form-item>

        <el-form-item label="确认新密码:" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" name="checkPass" type="password" autocomplete="off" placeholder="确认新密码" />
        </el-form-item>

        <el-form-item>
          <el-button class="passButton" type="primary" @click="submitForm('ruleForm')">重设密码</el-button>

        </el-form-item>
        <el-form-item>
          <el-button class="passButton2" @click="returnLogin">取消修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { yzlogin, resetLogin } from '@/api/user.js'
export default {
  name: 'ForgetPassword',
  data() {
    var validatePass3 = (rule, value, callback) => {
      var myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // var myreg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!myreg.test(value)) {
        callback(new Error('手机号输入不正确'))
      } else {
        callback()
      }
    }
    var validatePass4 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      disabled: false,
      ruleForm: {
        pass: '', // 新密码
        checkPass: '', // 确认新密码
        mobile: '', // 手机号
        code: ''// 验证码
      },
      rules: {
        mobile: [{ validator: validatePass3, trigger: 'blur' }],
        code: [{ validator: validatePass4, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      timeClock: null,
      yzmText: '发送验证码'
    }
  },
  beforeRouteLeave(to, from, next) {
    // ...
    clearInterval(this.timeClock)
    next()
  },
  beforeDestroy() {
    clearInterval(this.timeClock)
  },
  methods: {
    returnLogin() {
      this.$router.push({ path: 'login' })
      console.log(this.$route)
    },
    // 发送验证码
    getVerifyCode(mobile) {
      this.$refs.ruleForm.validateField('mobile', (mobileError) => {
        if (!mobileError) {
          yzlogin({
            mobile: this.ruleForm.mobile
          }).then(response => {
            if (response.code === 0) {
              this.initClock()
              this.$message.success('短信发送成功')
            } else {
              this.$message.error(response.msg)
            }
          }).catch(response => {
            this.$message.error(response.message)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    initClock() {
      var num = 60
      this.timeClock = setInterval(() => {
        if (num === 0) {
          this.yzmText = '发送验证码'
          clearInterval(this.timeClock)
        } else {
          num--
          this.yzmText = num
        }
      }, 1000)
    },
    // 重置密码
    submitForm() {
      const param = {
        mobile: this.ruleForm.mobile,
        code: this.ruleForm.code,
        password: this.$md5(this.ruleForm.checkPass.trim())
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          resetLogin(param).then(response => {
            console.log('111', response.code)
            if (response.code === 0) {
              this.$message.success('密码重置成功')
              this.$router.push({ path: '/login' })
            } else {
              this.$message.error(response.msg)
            }
          }).catch(response => {
            this.$message.error(response.message)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style  lang="scss">
.pass-container{
  height: 100%;
  background: url("../../assets/img/login/password-bj.png");
  background-size:100% 100%;
  .title-container{
      position: relative;
      width:700px;
      padding: 100px 35px 0;
      margin: 0 auto;
      overflow: hidden;
  }
  .form-content{
    // border: 1px solid #000;
    background: #000;
    background-color:rgba(0,0,0,0.2);
    margin-top: 50px;
    width: 40%;
    margin-left: 600px;
    text-align: center;
  }
  .demo-ruleForm{
      z-index: 999;
      position: relative;
      width: 450px;
      max-width: 100%;
      padding: 65px 35px 65px;
      margin: 0 auto;
      overflow: hidden;
      .el-input__inner {
        border: 1px solid #21748E;
        color: #fff;
      }
      .el-form-item.is-error .el-input__inner{
        border-color: #ff4949 !important;
      }
      .button-content{
        position: absolute;
        top:1px;
        left:180px;
        width: 60%;
        padding-left: 13px;
        height: 42px;
        line-height: 21px;
        background: #39A9C5;
        color: #fff;
        border: none;
      }
      .el-input--medium .el-input__inner {
          height: 42px;
          line-height: 42px;
      }
      .el-input__inner{
          background: transparent;
      }
      .el-form-item__label{
        font-size: 16px;
        color: #00eeee
      }
      .passButton{
        background: linear-gradient(to bottom, #2FCCEC, #1776C2);
        width: 100%;
        font-size: 20px;
      }
      .passButton2{
        // background: linear-gradient(to bottom, #2FCCEC, #1776C2);
        background: transparent;
        width: 100%;
        color: #fff;
        border: 1px solid #2FCCEC;
        font-size: 20px;
        &:hover{
          // background: linear-gradient(to bottom, #2FCCEC, #1776C2);
          opacity: 0.5;
        }
        &.el-button:hover, &.el-button:focus{
          color: #ffffff
        }
      }
  }
}
</style>
