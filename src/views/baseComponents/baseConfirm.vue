<template>
  <div>
    <p class="bkb" />
    <div class="confirm">{{ title }}</div>
    <div class="sureBtn">
      <el-button size="small" class="button-sub" @click="sureRemove">确认</el-button>
      <el-button size="small" class="button-cancle" @click="closeRemove">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    moveShow: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: '确认删除？'
    }
  },
  data() {
    return {
    }
  },
  activated() {
  },
  methods: {
    sureRemove() {
      this.$emit('sureMsg', false)
    },
    closeRemove() {
      this.$emit('confireMsg', false)
    }
  }
}
</script>
<style lang='scss'>
  @import "~@/styles/btn.scss";
.baseMove{
  .el-dialog__title{
    color: #00eeee;
    font-size: 16px;
    line-height: 34px;
  }
    .bkb{
        height: 1px;
        width: 90%;
        margin: -1px auto 0;
        background: radial-gradient(#53e3fd 20%, transparent 80%);
    }
  .el-dialog__header{
        background: linear-gradient(to bottom, rgba(83,227,253,1) 0%, rgba(83,227,253,0.0) 100%)!important;
  }
    .el-select.el-select--medium,.el-form-item--medium .el-form-item__content{
        width: 150px;
    }
    .el-input__inner,.el-input.is-disabled .el-input__inner{
        background: transparent!important;
        color: #fff!important;
        border-color: #00eeee!important;
    }
    .el-form-item.el-form-item--medium{
        margin: 30px 0 30px 60px;
    }
    .confirm{
        height: 48px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        margin: 38px
    }
    .sureBtn{
      text-align: center;
    }
    .el-dialog__headerbtn .el-dialog__close{
      color: #fff;
      &:hover{
        color: #00eeee
      }
    }
    .el-dialog__headerbtn{
      top: 0!important;
      &:focus{
        outline: none
      }
    }
}
</style>
