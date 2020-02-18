<template>
  <el-card class="box-card warningTwo">
    <div slot="header" class="clearfix">
      <span>消防数据报警</span>
      <span class="iconfont iconq-guanbi" @click="endK" />
    </div>
    <dataList :data-list="dataList" />
    <div class="countShow">弹窗关闭还有<span>{{ count }}</span>秒！</div>
  </el-card>
</template>
<script>
import dataList from '@/views/dashboard/components/dataList'
export default {
  name: 'WarningOne',
  components: { dataList },
  data() {
    return {
      timer: '',
      count: 60
    }
  },
  computed: {
    dataList() {
      return this.$store.state.dashord.dataListTwo
    }
  },
  activated() {
  },
  mounted() {
    this.startIntervals()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    startIntervals() {
      var _this = this
      _this.timer = window.setInterval(function() {
        // 不加window不生效系列
        if (_this.count === 0) {
          clearInterval(_this.timer)
          _this.$store.commit('dashord/setWarnTwos', false)
        } else {
          _this.count = _this.count - 1
        }
      }, 1000)
    },
    endK() {
      clearInterval(this.timer)
      this.$store.commit('dashord/setWarnTwos', false)
    }
  }
}
</script>
<style lang='scss'>
  @import "~@/styles/alertWarn.scss";
  .warningTwo{
    bottom: 40px;
    right: 30px;
  }
</style>
