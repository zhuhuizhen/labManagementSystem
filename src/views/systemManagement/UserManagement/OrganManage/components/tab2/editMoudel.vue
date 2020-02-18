<template>
  <div class="dialgEditform2">
    <p class="bkb" />
    <el-form ref="editForm" :model="editForm" label-width="130px" :rules="editFormRules">
      <el-row class="edittop">
        <el-col :span="12">
          <el-form-item label="上级管理中心:" prop="manageName">
            <el-input v-model="editForm.manageName" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="部门编号:" prop="code">
            <el-input v-model="editForm.code" autocomplete="off" placeholder="请输入部门编号" />
          </el-form-item>
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="editForm.name" autocomplete="off" placeholder="请输入部门名称" />
          </el-form-item>
          <el-form-item label="部门类型:" prop="type">
            <!-- <el-input v-model="row.type" autocomplete="off" placeholder="部门类型" /> -->
            <el-select v-model="editForm.type" popper-class="select-option" placeholder="-请选择部门类型-">
              <!-- <el-option label="-请选择-" value="" /> -->
              <el-option label="监控中心" value="0" />
              <el-option label="养护部门" value="1" />
              <el-option label="施工部门" value="2" />
              <el-option label="仓管部门" value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人:" prop="contacts">
            <el-input v-model="editForm.contacts" auto-complete="off" placeholder="请输入部门联系人" />
          </el-form-item>
          <el-form-item label="联系电话:" prop="phone">
            <el-input v-model="editForm.phone" autocomplete="off" placeholder="请输入部门联系电话" />
          </el-form-item>
          <el-form-item label="部门地址:" prop="deptAddr">
            <el-input v-model="editForm.deptAddr" autocomplete="off" placeholder="请输入部门地址" />
          </el-form-item>
          <el-form-item label="显示顺序:" prop="orderLevel">
            <el-input v-model="editForm.orderLevel" autocomplete="off" placeholder="请输入显示顺序" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述:" prop="remark">
            <el-input v-model="editForm.remark" type="textarea" placeholder="请输入备注" style="width:501px;margin-left:0px;margin-top:0px;height:70px" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div class="dialog-footer">
      <el-button size="medium" class="button-sub" @click.native="submitForm('editForm')">确定</el-button>
      <el-button size="medium" class="button-cancle" @click="handeleditFormVisible('editForm')">取消</el-button>
    </div>
  </div>
</template>

<script>
// import { deptInfoEdit } from '@/api/manage.js'
import { deptInfoEdit } from '@/api/userManagement.js'
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
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
        callback(new Error('请输入部门联系电话'))
      } else if (!myreg.test(value)) {
        callback(new Error('部门联系电话输入不正确'))
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
      // 编辑界面数据
      editForm: { manageName: '', code: '', name: '', type: '', contacts: '', phone: '', deptAddr: '', orderLevel: '', remark: '' },
      editFormRules: {
        code: [{ required: true, message: '请输入部门编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择部门类型', trigger: 'blur' }],
        contacts: [{ required: true, message: '请输入部门联系人', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePass1, trigger: 'blur' }],
        orderLevel: [{ required: true, validator: validatelevel, trigger: 'blur' }]
      },
      editFormVisible: false,
      disabled: true,
      value: ''
    }
  },
  watch: {
    row(newValue, oldVal) {
      this.editForm = Object.assign({}, this.row)
    }
  },
  mounted() {
    this.editForm = Object.assign({}, this.row)
    // console.log('treeedit', this.treeName)
    this.editForm.manageName = this.treeName
  },
  methods: {
    // 取消编辑
    handeleditFormVisible(formName) {
      this.$emit('handeleditFormVisible', this.editFormVisible)
      this.$refs[formName].resetFields()
      // this.$parent.visible = false
    },
    // 提交编辑页面
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.editForm.manageId = this.treeId
          const param = this.editForm
          param.manageId = this.treeId
          deptInfoEdit(param).then(response => {
            if (response.success === true) {
              this.$message.success('修改成功')
              this.$emit('handleGetTree1')
              // this.editForm.manageId = this.treeName
              this.$emit('handeleditFormVisible')
            } else {
              if (response.data !== '') {
                this.$message.error(response.data)
              } else {
                this.$message.error(response.msg)
              }
              // this.editForm.manageId = this.treeName
            }
          }).catch(response => {
            this.$message.error(response.message)
            // this.editForm.manageId = this.treeName
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

<style lang="scss">
.dialgEditform2{
   .edittop{
      padding-top:18px;
    }
    .el-input__inner {
      // cursor: pointer;
      height: 34px;
      width: 166px;
    }
    //input框间隔
   .el-form-item {
      margin-bottom: 10px;
     .el-input{
        font-size: 12px;
        // input{
        //   padding-left: 10px;
        // }
      }
   }
   .el-form-item__label{
     color:#00eeee;
   }
   .el-form-item__error{
    top:76%;
   }
   .dialog-footer{
     text-align: center;
     margin-top: 7px;
   }
   .el-form-item.is-success .el-input__inner{
    border-color: #00eeee;
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
