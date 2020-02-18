<template>
  <div class="navbar">

    <div class="left-menu">
      <img src="../../assets/img/favicon.png">
      <span>浙江省机电设备质量检测所</span>
    </div>
    <div class="right-menu">
      <!-- <search id="header-search" class="right-menu-item" />
      <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
      <el-popover
        ref="popover5"
        v-model="visible2"
        placement="bottom"
        width="150"
        :visible-arrow="false"
        popper-class="topHeader"
      >
        <li v-for="(item,index) in warnList" :key="index" class="warned" @click="changeCheck(item,index)">
          <span class="iconfont iconxiaoxiguanli" :style="{color:setColor(index)}">
            <img v-if="item.checked" src="../../assets/img/stop.png">
          </span>
          <span>{{ item.name }}</span>
        </li>
      </el-popover>
      <div v-popover:popover5 class="right-menu-item">
        <span class="iconfont iconxiaoxiguanli bigIcon" />
        <div class="allPoints">
          <li v-show="redshow" class="smallBd reds" :style="{margin:setMargin}" />
          <li v-show="yelshow" class="smallBd yellows" :style="{margin:setMargin}" />
          <li v-show="greshow" class="smallBd greens" :style="{margin:setMargin}" />
        </div>
      </div>
      <div class="imgContain">
        <p class="imgP"><img src="../../assets/img/header.png"><span>{{ this.$store.getters.name }}</span></p>
        <p @click="logout"><span class="iconfont iconq-exit" /></p>
      </div>
      <!-- <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>
              个人信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <base-remove ref="baseRemoved" :msg="msg" :titles="titles" />
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import baseRemove from '@/components/baseRemove/baseRemove'
import { remeberUser, getShort } from '@/api/dashboard'
// getShort
export default {
  components: { baseRemove },
  // computed: {
  //   ...mapGetters([
  //     'avatar',
  //     'device'
  //   ])
  // },
  data() {
    return {
      warnList: [{ 'name': '消防数据报警', 'checked': true }, { 'name': '视频事件检测', 'checked': true }, { 'name': '环境数据报警', 'checked': true }],
      checkItem: 'checkItem',
      noCheckItem: 'noCheckItem',
      msg: '确认退出',
      titles: '退出',
      visible2: false,
      redshow: false,
      yelshow: false,
      greshow: false,
      pointNum: 0
    }
  },
  computed: {
    setMargin() {
      if (this.pointNum === 3) {
        return '3px 0'
      } else if (this.pointNum === 2) {
        return '6px 0'
      } else if (this.pointNum === 1) {
        return '12px 0'
      } else {
        return '0'
      }
    }
  },
  // beforeMount() {
  //   this.getshorts()
  // },
  mounted() {
    this.getShorts()
  },
  methods: {
    async logout() {
      // await this.$store.dispatch('user/logout')
      // this.$router.push(`/login`)
      this.$refs.baseRemoved.sureDioag = true
    },
    setColor(index) {
      if (index === 0) {
        return 'red'
      } else if (index === 1) {
        return 'yellow'
      } else {
        return 'green'
      }
    },
    changeCheck(item, index) {
      if (item.checked) {
        this.pointNum++
      } else {
        this.pointNum--
      }
      if (index === 0) {
        this.redshow = item.checked
      } else if (index === 1) {
        this.yelshow = item.checked
      } else if (index === 2) {
        this.greshow = item.checked
      }
      item.checked = !item.checked
      const userId = this.$store.state.user.userId
      var shortcutId = this.$store.state.dashord.shortcuts
      if (shortcutId.length !== 0) {
        shortcutId = shortcutId.join(',')
      } else {
        shortcutId = ''
      }
      var warnType = []
      this.warnList.forEach((item, index) => {
        if (!item.checked) {
          if (index === 0) {
            warnType.push('1')
          } else if (index === 1) {
            warnType.push('2')
          } else {
            warnType.push('0')
          }
        }
      })
      if (warnType.length !== 0) {
        warnType = warnType.join(',')
      } else {
        warnType = ''
      }
      const params = {
        'userId': userId,
        'shortcutId': shortcutId,
        'warnType': warnType
      }
      remeberUser(params).then(res => {

      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    getShorts() {
      // debugger
      getShort().then(res => {
        this.$store.commit('dashord/allDatas', res.data)
        this.$store.commit('dashord/indexDatas', res)
        sessionStorage.setItem('allData', JSON.stringify(res.data))
        var warnTypes = []
        // if (res.data.warnTypes) {
        // const res = this.$store.state.dashord.indexData
        if (res.data.warnTypes !== '' && res.data.warnTypes) {
          warnTypes = res.data.warnTypes.split(',')
          warnTypes.forEach((item, index) => {
            if (item === '') {
              warnTypes.splice(index, 1)
            }
          })
          this.pointNum = warnTypes.length
          warnTypes.forEach(item => {
            if (item === '0') {
              this.warnList[2].checked = false
              this.greshow = true
            } else if (item === '1') {
              this.warnList[0].checked = false
              this.redshow = true
            } else if (item === '2') {
              this.warnList[1].checked = false
              this.yelshow = true
            }
          })
        }
        // }
        this.$store.dispatch('dashord/warnType', warnTypes)
      })
    }
  }
}
</script>

<style lang="scss" >
  @import "~@/styles/variables.scss";
.navbar {
  height: 64px;
  overflow: hidden;
  position: relative;
  color:$white;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .left-menu{
    float: left;
    margin-left: 24px;
    // line-height: 64px;
    img{
      width: 76px;
      height: 36px;
      vertical-align: middle;
    }
    span{
      font-style:italic;
      font-size:24px;
      vertical-align: middle;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    // line-height: 50px;

    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      width:50px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      line-height: 64px;
      position: relative;
      cursor: pointer;
      top: -7px;
      &:hover{
        transform:scale(1.1)
      }
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
      .bigIcon{
        font-size:25px;
        color:#fff;
        width:25px;
        height:100%;
        margin-right:3px;
      }
      .allPoints{
        display:inline-block;
        position: absolute;
        width: 6px;
        height: 28px;
        bottom: 2px;
        ul{
          display: flex;
          align-items: center;
        }
        .smallBd{
          // display: inline-block;
          width:6px;
          height:6px;
          border-radius:50%;
        }
        .reds{
          background:red;
        }
        .yellows{
          background:yellow;
        }
        .greens{
          background:green;
        }
      }
    }
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .imgContain{
    float: right;
    display: flex;
    align-items: center;
    height: 100%;
    p{
      display: inline-block;
      margin: 0;
    }
    .imgP{
      width: 100px;
      text-align: right;
      height: 36px;
      overflow: hidden;
      &:hover{
        transform:scale(1.1)
      }
      img{
        width: 36px;
        height: 36px;
        margin-right: 6px;
      vertical-align: middle;
      }
      span{
        line-height: 36px;
      vertical-align: middle;
      }
    }
    .iconq-exit{
      float: right;
      margin: 0 18px 0 24px;
      cursor: pointer;
      &:hover{
        transform:scale(1.1)
      }
    }
  }
}
.topHeader{
  margin-top: 0px!important;
  margin-left: 110px!important;
  padding: 0px !important;
  border: none;
  background: #062132;
  color: #fff;
    .warned{
      cursor: pointer;
      list-style: none;
      width: 100%;
      height: 40px;
      line-height: 40px;
      &:hover{
        background: rgba(83,227,253,.28)
      }
      &>span{
        position: relative;
        vertical-align: middle;
        &>img{
          display: inline-block;
          border-radius: 50%;
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 12px;
          overflow: hidden;
          width: 12px;
          height: 12px;
        }
      }
      &>.iconfont{
        font-size: 22px;
        margin: 0 6px 0 10px;
      }
    }
}

</style>
