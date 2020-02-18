<template>
  <div class="dashboard-container">
    <el-row type="flex" class="container-first" justify="space-between">
      <el-col :span="11" class=""><mywork ref="myworks" class="grid-content" /></el-col>
      <el-col :span="6" class="bg-left"><shortcut ref="shortcuts" class="grid-content" /></el-col>
      <el-col :span="7" class="bg-left"><system ref="systems" class="grid-content sysCheck" /></el-col>
    </el-row>
    <el-row class="container-second">
      <el-col :span="24"><navigation ref="navigations" class="grid-content" /></el-col>
    </el-row>
    <el-row type="flex" class="container-three" justify="space-between">
      <el-col :span="9"><curing ref="curings" class="grid-content bolckSs" /><environmentDataAlarm ref="environmentDataAlarms" class="grid-content bolckSs" /></el-col>
      <el-col :span="9" class="bg-left"><fireDataAlarm ref="fireDataAlarms" class="grid-content bolckSs" /><videoEventDetection ref="videoEventDetections" class="grid-content bolckSs" /></el-col>
      <el-col :span="6" class="bg-left"><informationBoard ref="informationBoards" class="grid-content" /></el-col>
    </el-row>
    <el-row class="container-four">
      <el-col :span="24"><vehicleFlow ref="vehicleFlows" class="grid-content" /></el-col>
    </el-row>
    <el-row class="container-five">
      <el-col :span="24"><speed ref="speeds" class="grid-content" /></el-col>
    </el-row>
    <span />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import { getSession } from '@/api/dashboard'

import { mywork, shortcut, system, navigation, vehicleFlow, speed, curing, fireDataAlarm, environmentDataAlarm, videoEventDetection, informationBoard } from './components'

export default {
  name: 'Dashboard',
  components: { mywork, shortcut, system, navigation, vehicleFlow, speed, curing, fireDataAlarm, environmentDataAlarm, videoEventDetection, informationBoard },
  data() {
    return {
      currentRole: 'adminDashboard',
      refreshAll: null// 首页在线实时刷新
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  mounted() {
    // 进入路由页面
    this.startRefresh()
  },
  methods: {
    startRefresh() {
      this.refreshAll = setInterval(() => {
        this.$refs.myworks.refreshTab()
        this.$refs.shortcuts.getShorts()
        this.$refs.systems.getSystems()
        this.$refs.navigations.againTos()
        this.$refs.curings.getSummarys()
        this.$refs.environmentDataAlarms.getList()
        this.$refs.fireDataAlarms.getList()
        this.$refs.informationBoards.getBoards()
        this.$refs.vehicleFlows.getVehicle()
        this.$refs.speeds.getSpeed()
      }, 3600000)
    }
    // getshorts() {
    //   getSession().then(res => {
    //     this.$store.commit('dashord/allDatas', res.data)
    //     this.$store.commit('dashord/indexDatas', res)
    //     sessionStorage.setItem('allData', JSON.stringify(res.data))
    //   // console.log(this.$store.state.dashord.allData)
    //   }).catch(res => {
    //     this.$message.error(res.data)
    //   })
    // }
  },
  beforeRouteLeave(to, from, next) {
    //  当前页面不销毁的情况下，点击页签切换到别的路由
    clearInterval(this.refreshAll)
    next()
  }
}
</script>
<style lang='scss'>
  .dashboard-container{
    .container-first{
      .el-tab-pane{
        padding: 0!important;
      }
    }
    font-size: 12px;
    padding:18px 0 0 16px;
    .el-row {
      color:#fff;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .grid-content {
      border-radius: 4px;
      min-height: 106px;
      border:1px solid #00eeee;
      background: rgba(0,54,77,.3);
      background-image: radial-gradient(rgba(1,34,49,0.5), rgba(2,160,219,0.2));
    }
    .sysCheck{
      overflow: hidden;
    }
    .bolckSs{
      min-width:603px;
    }
    .bg-left{
      margin-left: 16px;
    }
  }
</style>
