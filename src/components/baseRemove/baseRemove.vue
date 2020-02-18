<template>
  <el-dialog :title="titles" :visible.sync="sureDioag" append-to-body class="typeInfoAdd outGoing">
    <div class="sureRemove">{{ msg }}</div>
    <div class="goOut">
      <!-- <span @click="sureClick">确认</span><span @click="confireClick">取消</span> -->
      <el-button size="small" class="button-sub" @click="sureClick">确认</el-button>
      <el-button size="small" class="button-cancle" @click="confireClick">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    titles: {
      type: String,
      required: true
    },
    msg: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      sureDioag: false
    }
  },
  methods: {
    sureClick() {
      this.sureDioag = false
      this.$store.dispatch('tagsView/delAllVisitedViews', '')
      this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    confireClick() {
      this.sureDioag = false
    }
  }
}
</script>
<style lang='scss'>
  @import "~@/styles/btn.scss";
  @import "~@/styles/manage.scss";
  .typeInfoAdd{
      .allSure{
          span{
              &:hover{
                  opacity: 0.7;
              }
          }
      }
  }
  .outGoing{
    .goOut{
      width: 100%;
      text-align: center;
    }
    .button-cancle{
      margin-left: 38px
    }
  }
</style>
