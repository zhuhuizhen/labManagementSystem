<template>
  <div class="dialgAddform1">
    <p class="bkb" />
    <el-form ref="addForm" :model="addForm" label-width="140px" :rules="addFormRules" class="formAdd">
      <el-row class="addtop">
        <el-col :span="12">
          <el-form-item label="区域ID:" prop="code">
            <el-input v-model="addForm.code" placeholder="请输入区域ID" />
          </el-form-item>
          <el-form-item label="区域负责人:" prop="manager">
            <el-input v-model="addForm.manager" auto-complete="off" placeholder="请输入区域负责人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域名称:" prop="name">
            <el-input v-model="addForm.name" placeholder="请输入区域名称" />
          </el-form-item>
          <el-form-item label="联系电话:" prop="phone">
            <el-input v-model="addForm.phone" autocomplete="off" placeholder="请输入区域联系电话" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述:" prop="remark">
            <el-input v-model="addForm.remark" type="textarea" placeholder="请输入备注" style="width:577px;margin-left:0px;margin-top:0px;height:70px" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer">
      <el-button size="medium " class="button-sub" @click.native="submitForm('addForm')">确定</el-button>
      <el-button size="medium " class="button-cancle" @click="handeladdFormVisible">取消</el-button>
    </div>
  </div>
</template>

<script>
// import { managementCenterEdit } from '@/api/manage.js'
import { managementCenterEdit } from '@/api/userManagement.js'
export default {
  props: {
    treeName: {
      type: String,
      default: () => ''
    },
    treeId: {
      type: String,
      default: () => ''
    }
    // treeName: String,
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      var myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // var myreg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入管理中心联系电话'))
      } else if (!myreg.test(value)) {
        callback(new Error('管理中心联系电话输入不正确'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      var myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // var myreg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入路损赔偿联系电话'))
      } else if (!myreg.test(value)) {
        callback(new Error('路损赔偿联系电话输入不正确'))
      } else {
        callback()
      }
    }
    var validatelevel = (rule, value, callback) => {
      var myreg = /^(0?[1-9]|1[0-9]|20)$/
      if (value === '') {
        callback(new Error('请输入显示顺序'))
      } else if (!myreg.test(value)) {
        callback(new Error('请输入1-20的整数显示顺序'))
      } else {
        callback()
      }
    }
    return {
      // 新增界面数据  state: '',
      addForm: { manageparentName: '', code: '', name: '', assetNum: '', mileage: '', direction: '', unitAddr: '', manager: '', phone: '', claimant: '', claimantPhone: '', orderLevel: '', remark: '' },
      addFormVisible: false,
      addFormRules: {
        code: [{ required: true, message: '请输入组织编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
        assetNum: [{ required: true, message: '请输入资产编码', trigger: 'blur' }],
        manager: [{ required: true, message: '请输入管理中心负责人', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePass1, trigger: 'blur' }],
        claimant: [{ required: true, message: '请输入路损赔偿负责人', trigger: 'blur' }],
        claimantPhone: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        // state: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        orderLevel: [{ required: true, validator: validatelevel, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.addForm.manageparentName = this.treeName
  },
  methods: {
    // 取消新增
    handeladdFormVisible(addFormVisible) {
      this.$emit('handeladdFormVisible', this.addFormVisible)
      this.addForm = {}
    },
    // 提交新增
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = this.addForm
          param.parentId = this.treeId
          managementCenterEdit(param).then(response => {
            if (response.success === true) {
              this.$message.success('新增成功')
              this.$emit('handleGetTree1')
              this.handeladdFormVisible()
            } else {
              if (response.data !== '') {
                this.$message.error(response.data)
              } else {
                this.$message.error(response.msg)
              }
            }
          }).catch(response => {
            this.$message.error(response.message)
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
    // 清空新增数据
    // clearDate() {
    //   this.addForm = {}
    // }
  }
}
</script>

<style lang="scss">
.dialgAddform1{
   .formAdd{
     padding-left: 40px;
   }
   .addtop{
      padding-top:18px;
   }
   .el-input__inner {
    // cursor: pointer;
    height: 34px;
    width: 166px;
   }
   .el-form-item__label{
     color:#00eeee !important;
   }
   //input框间隔
   .el-form-item {
    margin-bottom: 10px;
    .el-input{
      font-size: 12px;
      // input{
        // padding-left: 10px;
      // }
    }
  }
  .el-form-item__error{
    top:76%;
  }
  .el-form-item.is-success .el-input__inner{
    border-color: #00eeee;
  }
   .dialog-footer{
     text-align: center;
     margin-top: 10px;
   }
   .el-input.is-disabled .el-input__inner{
     background-color: transparent;
     border:1px solid rgba(80,220,245,1);
   }
   input::-webkit-input-placeholder {
      opacity: 0.5;
   }
    textarea::-webkit-input-placeholder {
      opacity: 0.5;
    }
    .el-textarea.el-input--medium .el-textarea__inner {
      height: 80px;
      font-size: 12px;
    }

}
</style>
