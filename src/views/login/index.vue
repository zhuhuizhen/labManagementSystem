<template>
  <div class="login-container">
    <div class="title-container">
      <img src="../../assets/img/login/logoimg.png">
    </div>
    <div class="game-img">
      <img src="../../assets/img/login/grama.png" class="game-img">
    </div>
    <div class="img-ruleForm">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="off">
        <el-form-item prop="username">
          <el-input ref="username" v-model="loginForm.username" placeholder="账号" name="username" type="text" autocomplete="off" />
          <img src="../../assets/img/login/icologin.png" class="inputimg">
        </el-form-item>
        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <el-input ref="password" :key="passwordType" v-model="loginForm.password" placeholder="密码" :type="passwordType" name="password" autocomplete="off" @blur="capsTooltip=false" @keyup.native="checkCapslock" @keyup.enter.native="handleLogin" />
            <img src="../../assets/img/login/icopass.png" class="inputimg">
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-button :loading="loading" type="primary" class="loginaButton" @click.native="handleLogin">登录</el-button>
        <a style="float:right;color:#fff;font-size:14px;margin-right:5px;margin-top:-10px;" @click="handleForgetPassword">忘记密码</a>
      </el-form>
    </div>
    <div class="foot-content">
      <p>浙江省机电设计研究院</p>
      <p>浙江省杭州市滨江区庙后王路125号</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    // 密码校验
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ trigger: 'blur', validator: validatePassword }] },
      loading: false,
      redirect: undefined,
      otherQuery: {},
      passwordType: 'password',
      capsTooltip: false// 输入密码是否显示
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    // 密码是否显示
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const param = {
            userName: this.loginForm.username,
            password: this.$md5(this.loginForm.password.trim())
          }
          // console.log('111', param)
          this.$store.dispatch('user/login', param)
            .then((response) => {
              // debugger
              if (response.success === true) {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              } else {
                this.loading = false
                this.$message({
                  type: 'error',
                  message: response.msg
                })
              }
            })
            .catch((response) => {
              this.$message.error(response.message)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 忘记密码
    handleForgetPassword() {
      this.$router.push({ path: '/forgetPassword' })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" >
.login-container {
  .el-form-item{
    background: transparent!important
  }
  background: url("../../assets/img/login/login.png");
  background-size:100% 100%;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  .title-container{
      position: relative;
      top:180px;
      right: -1050px;
  }
  .game-img{
      float: left;
      margin-top: -80px;
      margin-left: 100px;
  }
  .img-ruleForm{
      width: 446px;
      height: 345px;
      float: right;
      margin-right: 300px;
      margin-top: 230px;
      background: url("../../assets/img/login/login_bj.png") no-repeat;
  }
  .login-form {
    position: relative;
    width: 350px;
    max-width: 100%;
    padding: 80px 40px 0;
    margin: 0 auto;
    overflow: hidden;
    .inputimg{
      position: absolute;
      top: 10px;
      // margin-left: 10px;
      width: 20px;
      height: 20px;
      left: -35px;
    }
    .el-input--medium .el-input__inner {
        height: 40px;
        line-height: 40px;
    }
    .el-input__inner{
        background:#000;
        background-color:rgba(0,0,0,0.2);
        border: 1px solid #124D6A;
        color: #fff;
        padding-left:20px;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 3px;
        font-size: 16px;
        cursor: pointer;
        user-select: none;
        color: #fff;
        opacity:0.6;
     }
     .loginaButton{
        font-size: 18px;
        width: 100%;
        margin-bottom: 30px;
        height: 40px;
        background: linear-gradient(to bottom, #2DCBF3, #0D7BC6);
     }
  }
  .foot-content{
      clear: both;
      color: #fff;
      font-size: 14px;
      text-align: center;
      position: absolute;
      bottom: 25px;
      left: 900px;
  }

}
</style>
